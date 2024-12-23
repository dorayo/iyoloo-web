// server/api/routers/recharge.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  iUserAccount,
  iRecordVip,
  iRecordGoldCoin,
  iRecordTranslate,
  iRecordBill,
} from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export const rechargeRouter = createTRPCRouter({
  // VIP充值
  rechargeVip: protectedProcedure
    .input(
      z.object({
        orderNo: z.string(),
        vipLevel: z.number(),
        month: z.number(),
        amount: z.number(),
        paypalOrderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 开始事务
      return await ctx.db.transaction(async (tx) => {
        try {
          // 1. 获取并验证订单
          const order = await tx.query.iRecordVip.findFirst({
            where: and(
              eq(iRecordVip.orderNo, input.orderNo),
              eq(iRecordVip.status, 0),
            ),
          });

          if (!order) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "订单不存在或状态异常",
            });
          }

          // 2. 获取用户账户信息
          const userAccount = await tx.query.iUserAccount.findFirst({
            where: eq(iUserAccount.userId, order.buyUserId!),
          });

          if (!userAccount) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "用户账户不存在",
            });
          }

          // 3. 计算新的VIP到期时间
          const currentExpiration = userAccount.vipExpiration || new Date();
          const newExpiration = new Date(currentExpiration);
          newExpiration.setMonth(newExpiration.getMonth() + input.month);

          // 4. 更新用户账户
          await tx
            .update(iUserAccount)
            .set({
              vipLevel: input.vipLevel,
              vipOpen: new Date(),
              vipExpiration: newExpiration,
              vipCharacter: input.vipLevel === 1 ? 200 : 800, // VIP 200字符/月，SVIP 800字符/月
              totalAmount: (Number(userAccount.totalAmount) + input.amount).toString(),
            })
            .where(eq(iUserAccount.userId, order.buyUserId!));

          // 5. 更新订单状态
          await tx
            .update(iRecordVip)
            .set({
              status: 2, // 已支付（已完成）
              payTime: new Date(),
            })
            .where(eq(iRecordVip.orderNo, input.orderNo));

          if (!order.buyUserId) {
            throw new Error("buyUserId is required");
          }
          // 6. 创建账单记录
          await tx.insert(iRecordBill as any).values({
            userId: order.buyUserId,
            type: 1, // 充值
            typeCode: 20, // VIP充值
            accountChange: `购买${input.month}个月${input.vipLevel === 1 ? "VIP" : "SVIP"}会员`,
            sign: 1, // 正
            amount: input.amount,
            recordId: order.id,
            otherUserId: 0,
            aUserId: 0,
            rate: 0,
            commission: 0,
          });

          return { success: true };
        } catch (error) {
          console.error("VIP充值失败:", error);
          throw error;
        }
      });
    }),

  // 金币充值
  rechargeGoldCoin: protectedProcedure
    .input(
      z.object({
        orderNo: z.string(),
        goldCoin: z.number(),
        amount: z.number(),
        paypalOrderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        try {
          // 1. 获取并验证订单
          const order:any = await tx.query.iRecordGoldCoin.findFirst({
            where: and(
              eq(iRecordGoldCoin.orderNo, input.orderNo),
              eq(iRecordGoldCoin.status, 0),
            ),
          });

          if (!order) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "订单不存在或状态异常",
            });
          }

          // 2. 获取用户账户信息
          const userAccount = await tx.query.iUserAccount.findFirst({
            where: eq(iUserAccount.userId, order.buyUserId),
          });

          if (!userAccount) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "用户账户不存在",
            });
          }

          // 3. 更新用户账户
          await tx
            .update(iUserAccount)
            .set({
              goldCoin: (Number(userAccount.goldCoin) + input.goldCoin).toString(),
              totalAmount: (Number(userAccount.totalAmount) + input.amount).toString(),
            })
            .where(eq(iUserAccount.userId, order.buyUserId));

          // 4. 更新订单状态
          await tx
            .update(iRecordGoldCoin)
            .set({
              status: 2,
              payTime: new Date(),
            })
            .where(eq(iRecordGoldCoin.orderNo, input.orderNo));

          // 5. 创建账单记录
          await tx.insert(iRecordBill as any).values({
            userId: order.buyUserId!,
            type: 1,
            typeCode: 10, // 金币充值
            accountChange: `充值${input.goldCoin}金币`,
            sign: 1,
            amount: input.amount,
            recordId: order.id,
            otherUserId: 0,
            aUserId: 0,
            rate: 0,
            commission: 0,
          });

          return { success: true };
        } catch (error) {
          console.error("金币充值失败:", error);
          throw error;
        }
      });
    }),

  // 翻译包充值
  rechargeTranslate: protectedProcedure
    .input(
      z.object({
        orderNo: z.string(),
        character: z.number(),
        amount: z.number(),
        paypalOrderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        try {
          // 1. 获取并验证订单
          const order = await tx.query.iRecordTranslate.findFirst({
            where: and(
              eq(iRecordTranslate.orderNo, input.orderNo),
              eq(iRecordTranslate.status, 0),
            ),
          });

          if (!order) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "订单不存在或状态异常",
            });
          }

          // 2. 获取用户账户信息
          const userAccount = await tx.query.iUserAccount.findFirst({
            where: eq(iUserAccount.userId, order.buyUserId!),
          });

          if (!userAccount) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "用户账户不存在",
            });
          }

          // 3. 更新用户账户
          await tx
            .update(iUserAccount)
            .set({
              character: Number(userAccount.character) + input.character,
              totalAmount: (Number(userAccount.totalAmount) + input.amount).toString(),
            })
            .where(eq(iUserAccount.userId, order.buyUserId!));

          // 4. 更新订单状态
          await tx
            .update(iRecordTranslate)
            .set({
              status: 2,
              payTime: new Date(),
            })
            .where(eq(iRecordTranslate.orderNo, input.orderNo));

          // 5. 创建账单记录
          await tx.insert(iRecordBill as any).values({
            userId: order.buyUserId!,
            type: 1,
            typeCode: 30, // 翻译包充值
            accountChange: `充值${input.character}个翻译字符`,
            sign: 1,
            amount: input.amount,
            recordId: order.id,
            otherUserId: 0,
            aUserId: 0,
            rate: 0,
            commission: 0,
          });

          return { success: true };
        } catch (error) {
          console.error("翻译包充值失败:", error);
          throw error;
        }
      });
    }),
});
