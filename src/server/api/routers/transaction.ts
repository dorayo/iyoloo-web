// server/api/routers/transaction.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { and, eq, sql } from "drizzle-orm";
import {
  iRecordRedEnvelopes,
  iRecordBill,
  iUserAccount,
  iUser,
} from "~/server/db/schema";

export const transactionRouter = createTRPCRouter({
  // 发送金币/红包
  sendCoins: protectedProcedure
    .input(
      z.object({
        recipientId: z.number(),
        amount: z.number().positive(),
        remark: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 获取发送者信息
      const sender = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
        with: {
          userAccount: true,
        },
      });

      if (!sender) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "发送者账号不存在",
        });
      }

      // 检查余额
      if (Number(sender?.userAccount?.goldCoin) < input.amount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "余额不足",
        });
      }

      // 获取接收者信息
      const recipient = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.id, input.recipientId),
      });

      if (!recipient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "接收者账号不存在",
        });
      }

      // 生成订单号
      const orderNo = `RED${Date.now()}${Math.floor(Math.random() * 1000)}`;

      // 开启事务
      return await ctx.db.transaction(async (tx) => {
        // 1. 创建红包记录
        await tx.insert(iRecordRedEnvelopes).values({
          brand: "iyoloo",
          orderNo,
          giveUserId: sender.id,
          giveNickname: sender.nickname,
          recipientUserId: recipient.id,
          recipientNickname: recipient.nickname,
          goldCoin: input.amount.toString(),
          remark: input.remark || "",
          status: 0, // 待领取
        });

        // 2. 扣除发送者金币
        await tx
          .update(iUserAccount)
          .set({
            goldCoin: sql`gold_coin - ${input.amount}`,
          })
          .where(eq(iUserAccount.userId, sender.id));

        // 3. 记录账单 - 发送者
        await tx.insert(iRecordBill).values({
          userId: sender.id,
          type: 2, // 消费
          typeCode: 8, // 发送红包
          sign: 0,
          amount: input.amount.toString(),
          accountChange: `发送红包 -${input.amount}金币`,
          remark: `发送红包给${recipient.nickname}`,
          otherUserId: recipient.id,
        });

        return {
          success: true,
          orderNo,
        };
      });
    }),

  // 领取红包
  receiveCoins: protectedProcedure
    .input(
      z.object({
        orderNo: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 获取红包记录
      const redEnvelope = await ctx.db.query.iRecordRedEnvelopes.findFirst({
        where: and(
          eq(iRecordRedEnvelopes.orderNo, input.orderNo),
          eq(iRecordRedEnvelopes.status, 0),
        ),
      });

      if (!redEnvelope) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "红包不存在或已被领取",
        });
      }

      // 验证接收者
      const recipient = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!recipient || recipient.id !== redEnvelope.recipientUserId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "您无权领取此红包",
        });
      }

      // 开启事务
      return await ctx.db.transaction(async (tx) => {
        // 1. 更新红包状态
        await tx
          .update(iRecordRedEnvelopes)
          .set({
            status: 1, // 已领取
          })
          .where(eq(iRecordRedEnvelopes.orderNo, input.orderNo));

        // 2. 增加接收者金币
        await tx
          .update(iUserAccount)
          .set({
            goldCoin: sql`gold_coin + ${redEnvelope.goldCoin}`,
          })
          .where(eq(iUserAccount.userId, recipient.id));

        // 3. 记录账单 - 接收者
        await tx.insert(iRecordBill).values({
          userId: recipient.id,
          type: 3, // 赠送
          typeCode: 9, // 领取红包
          sign: 1,
          amount: redEnvelope.goldCoin,
          accountChange: `领取红包 +${redEnvelope.goldCoin}金币`,
          remark: `收到来自${redEnvelope.giveNickname}的红包`,
          otherUserId: redEnvelope.giveUserId,
        });

        return {
          success: true,
          amount: redEnvelope.goldCoin,
        };
      });
    }),

  // 获取红包记录
  getRedEnvelopeRecords: protectedProcedure
    .input(
      z.object({
        type: z.enum(["sent", "received"]),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }

      const offset = (input.page - 1) * input.pageSize;

      const where =
        input.type === "sent"
          ? eq(iRecordRedEnvelopes.giveUserId, user.id)
          : eq(iRecordRedEnvelopes.recipientUserId, user.id);

      const [records, total] = await Promise.all([
        ctx.db.query.iRecordRedEnvelopes.findMany({
          where,
          limit: input.pageSize,
          offset,
          orderBy: (redEnvelope, { desc }) => [desc(redEnvelope.insertTime)],
        }),
        ctx.db
          .select({ count: sql<number>`cast(count(*) as unsigned)` })
          .from(iRecordRedEnvelopes)
          .where(where)
          .then((result) => Number(result[0].count)),
      ]);

      return {
        records,
        pagination: {
          page: input.page,
          pageSize: input.pageSize,
          total,
          totalPages: Math.ceil(total / input.pageSize),
        },
      };
    }),
});
