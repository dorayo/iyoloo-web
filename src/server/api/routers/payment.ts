// server/api/routers/payment.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  iRecordVip,
  iRecordGoldCoin,
  iRecordTranslate,
  iUser,
  iUserAccount,
  iRecordBill
} from "~/server/db/schema";
import { verifyPayPalPayment } from "~/hooks/paypal";
import { eq } from "drizzle-orm";
// 生成唯一订单号
const generateOrderNo = () => {
  return `${Date.now()}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;
};

export const paymentRouter = createTRPCRouter({
  // 初始化支付 - 创建待支付订单
  initializePayment: protectedProcedure
    .input(
      z.object({
        amount: z.string(),
        productType: z.enum(["vip", "svip", "goldCoin", "translate"]),
        productDetails: z.object({
          vipLevel: z.number().optional(),
          month: z.number().optional(),
          goldCoin: z.number().optional(),
          giveGoldCoin: z.number().optional(),
          character: z.number().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }

      const orderNo = generateOrderNo();

      // 只创建初始订单记录，不进行充值操作
      try {
        if (input.productType === "vip" || input.productType === "svip") {
          await ctx.db.insert(iRecordVip).values({
            orderNo,
            buyUserId: user.id,
            buyNickname: user.nickname!,
            recipientUserId: user.id,
            vipLevel: input.productDetails.vipLevel!,
            month: input.productDetails.month!,
            amount: input.amount,
            payType: 3, // PayPal
            status: 0, // 待支付
          });
        } else if (input.productType === "goldCoin") {
          await ctx.db.insert(iRecordGoldCoin).values({
            orderNo,
            buyUserId: user.id,
            buyNickname: user.nickname!,
            recipientUserId: user.id,
            amount: input.amount,
            goldCoin: input.productDetails.goldCoin!.toString(),
            payType: 3,
            status: 0,
          });
        } else if (input.productType === "translate") {
          await ctx.db.insert(iRecordTranslate).values({
            orderNo,
            buyUserId: user.id,
            buyNickname: user.nickname!,
            recipientUserId: user.id,
            characterNum: input.productDetails.character!,
            amount: input.amount,
            payType: 3,
            status: 0,
          });
        }

        return {
          success: true,
          orderNo,
        };
      } catch (error) {
        console.error("创建订单失败:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "创建订单失败",
        });
      }
    }),

  // 完成支付 - 验证支付并调用充值
  completePayment: protectedProcedure
    .input(
      z.object({
        orderNo: z.string(),
        paypalOrderId: z.string(),
        productType: z.enum(["vip", "svip", "goldCoin", "translate"]),
        expectedAmount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // 1. 验证PayPal支付结果
        const verificationResult = await verifyPayPalPayment(
          input.paypalOrderId,
          input.expectedAmount,
        );
        console.log("PayPal payment verification result:", verificationResult);
        if (!verificationResult.verified) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: verificationResult.error || "Payment verification failed",
          });
        }

        // 检查是否为重复支付
        // const existingPayment = await db.query.somePaymentTable.findFirst({
        //   where: eq(somePaymentTable.paypalOrderId, paypalOrderId),
        // });

        // if (existingPayment) {
        //   throw new Error("Payment already processed");
        // }

        // 2. 查找并验证订单
        let order;
        if (input.productType === "vip" || input.productType === "svip") {
          order = await ctx.db.query.iRecordVip.findFirst({
            where: eq(iRecordVip.orderNo, input.orderNo),
          });
        } else if (input.productType === "goldCoin") {
          order = await ctx.db.query.iRecordGoldCoin.findFirst({
            where: eq(iRecordGoldCoin.orderNo, input.orderNo),
          });
        } else if (input.productType === "translate") {
          order = await ctx.db.query.iRecordTranslate.findFirst({
            where: eq(iRecordTranslate.orderNo, input.orderNo),
          });
        }
        console.log("order:", order);
        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "订单不存在",
          });
        }

        if (order?.status !== 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "订单状态异常",
          });
        }

        // 3. 调用对应的充值逻辑
        // if (input.productType === "vip" || input.productType === "svip") {
        //   await rechargeRouter.rechargeVip.call({
        //     ctx,
        //     input: {
        //       orderNo: input.orderNo,
        //       vipLevel: order.vipLevel,
        //       month: order.month,
        //       amount: verificationResult.amount,
        //       paypalOrderId: input.paypalOrderId,
        //     },
        //   });
        // } else if (input.productType === "goldCoin") {
        //   await rechargeRouter.rechargeGoldCoin.call({
        //     ctx,
        //     input: {
        //       orderNo: input.orderNo,
        //       goldCoin: order.goldCoin,
        //       amount: verificationResult.amount,
        //       paypalOrderId: input.paypalOrderId,
        //     },
        //   });
        // } else if (input.productType === "translate") {
        //   await rechargeRouter.rechargeTranslate.call({
        //     ctx,
        //     input: {
        //       orderNo: input.orderNo,
        //       character: order.characterNum,
        //       amount: verificationResult.amount,
        //       paypalOrderId: input.paypalOrderId,
        //     },
        //   });
        // }

        // return {
        //   success: true,
        //   verificationResult,
        // };


        // 3. 开始事务处理
        return await ctx.db.transaction(async (tx) => {
          // 获取用户账户
          const userAccount = await tx.query.iUserAccount.findFirst({
            where: eq(iUserAccount.userId, order.buyUserId)
          });

          if (!userAccount) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "User account not found"
            });
          }

          // 根据产品类型执行不同的充值逻辑
          if (input.productType === 'vip' || input.productType === 'svip') {
            const vipLevel = input.productType === 'vip' ? 1 : 2;
            const newExpiration = new Date();
            newExpiration.setMonth(newExpiration.getMonth() + order.month);
            
            await tx.update(iUserAccount)
              .set({
                vipLevel: vipLevel,
                vipOpen: new Date(),
                vipExpiration: newExpiration,
                vipCharacter: vipLevel === 1 ? 200 : 800,
                totalAmount: (Number(userAccount.totalAmount) + verificationResult.amount).toString()
              })
              .where(eq(iUserAccount.userId, order.buyUserId));

              await tx.update(iRecordVip)
              .set({
                status: 2,
                payTime: new Date(),
              })
              .where(eq(iRecordVip.orderNo, input.orderNo));

          } else if (input.productType === 'goldCoin') {
            await tx.update(iUserAccount)
              .set({
                goldCoin: (Number(userAccount.goldCoin) + Number(order.goldCoin)).toString(),
                totalAmount: (Number(userAccount.totalAmount) + verificationResult.amount).toString()
              })
              .where(eq(iUserAccount.userId, order.buyUserId));

              await tx.update(iRecordGoldCoin)
              .set({
                status: 2,
                payTime: new Date(),
              })
              .where(eq(iRecordGoldCoin.orderNo, input.orderNo));

          }else if (input.productType === "translate") {
              await tx.update(iUserAccount)
              .set({
                character: Number(userAccount.character) + Number(order.characterNum),
                totalAmount: (Number(userAccount.totalAmount) + verificationResult.amount).toString()
              })
              .where(eq(iUserAccount.userId, order.buyUserId));

              await tx.update(iRecordTranslate)
              .set({
                status: 2,
                payTime: new Date(),
              })
              .where(eq(iRecordTranslate.orderNo, input.orderNo));
          }

          // 记录账单
          await tx.insert(iRecordBill as any).values({
            userId: order.buyUserId,
            type: 1,
            typeCode: input.productType === 'vip' ? 20 : 
                      input.productType === 'goldCoin' ? 10 : 30,
            accountChange: input.productType === 'vip' ? `购买${order.month}个月会员` :
                          input.productType === 'goldCoin' ? `充值${order.goldCoin}金币` :
                          `充值${order.characterNum}个翻译字符`,
            sign: 1,
            amount: verificationResult.amount.toString(),
            recordId: order.id,
            otherUserId: 0,
            aUserId: 0,
            rate: 0,
            commission: 0,
          });

          return {
            success: true,
            verificationResult
          };
        });
      } catch (error) {
        console.error("支付完成处理失败:", error);
        throw error;
      }
    }),

  // 查询订单状态
  getOrderStatus: protectedProcedure
    .input(
      z.object({
        orderNo: z.string(),
        productType: z.enum(["vip", "svip", "goldCoin", "translate"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      let order;
      if (input.productType === "vip" || input.productType === "svip") {
        order = await ctx.db.query.iRecordVip.findFirst({
          where: eq(iRecordVip.orderNo, input.orderNo),
        });
      } else if (input.productType === "goldCoin") {
        order = await ctx.db.query.iRecordGoldCoin.findFirst({
          where: eq(iRecordGoldCoin.orderNo, input.orderNo),
        });
      } else if (input.productType === "translate") {
        order = await ctx.db.query.iRecordTranslate.findFirst({
          where: eq(iRecordTranslate.orderNo, input.orderNo),
        });
      }

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "订单不存在",
        });
      }

      return {
        orderNo: order.orderNo,
        status: order.status,
        amount: order.amount,
        payTime: order.payTime,
      };
    }),
});
