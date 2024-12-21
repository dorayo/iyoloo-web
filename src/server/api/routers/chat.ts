// server/api/routers/chat.ts

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { inArray } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { iUser } from "~/server/db/schema";

export const chatRouter = createTRPCRouter({
  // 获取会话用户列表
  getSessionUsers: protectedProcedure
    .input(
      z.object({
        imAccounts: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const validAccounts = input.imAccounts.filter(
          (account) => account && account !== "iyolooundefined",
        );

        if (validAccounts.length === 0) {
          return [];
        }
        // 获取用户基本信息和账户信息
        const users = await ctx.db.query.iUser.findMany({
          where: inArray(
            iUser.account,
            validAccounts.map((account) =>
              parseInt(account.replace("iyoloo", "")),
            ),
          ),
          with: {
            userAccount: {
              // 选择需要的账户字段
              columns: {
                vipLevel: true,
              },
            },
          },
        });
        // console.log(333,users);

        // 转换并返回数据
        return users.map((user) => ({
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          account: user.account,
          imAccount: "iyoloo" + user.account, // 环信账号前缀
          onlineState: user.onlineState ?? 0,
          vipLevel: user.userAccount?.vipLevel ?? 0,
          language: user.language,
          region: user.region,
        }));
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch session users",
        });
      }
    }),

  // 获取用户在线状态
  getUsersOnlineStatus: protectedProcedure
    .input(
      z.object({
        userIds: z.array(z.number()),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const users = await ctx.db.query.iUser.findMany({
          where: inArray(iUser.id, input.userIds),
          columns: {
            id: true,
            onlineState: true,
          },
        });

        // 转换为id:status的映射
        return users.reduce(
          (acc, user) => ({
            ...acc,
            [user.id]: user.onlineState ?? 0,
          }),
          {} as Record<number, number>,
        );
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch online status",
        });
      }
    }),

  // 获取未读消息数
  // getUnreadCount: protectedProcedure
  //   .input(
  //     z.object({
  //       imAccount: z.string(),
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     try {
  //       // 通过环信账号找到对应用户
  //       const user = await ctx.db.query.iUser.findFirst({
  //         where: eq(iUser.account, parseInt(input.imAccount.replace('iyoloo', ''), 10)),
  //       });

  //       if (!user) {
  //         throw new TRPCError({
  //           code: 'NOT_FOUND',
  //           message: 'User not found',
  //         });
  //       }

  //       // 获取未读消息数
  //       const [result] = await ctx.db
  //         .select({
  //           count: sql<number>`cast(count(*) as unsigned)`,
  //         })
  //         .from(iMessageUser)
  //         .where(
  //           and(
  //             eq(iMessageUser.toUserId, user.id),
  //             eq(iMessageUser.isRead, 0),
  //             eq(iMessageUser.isDelete, 0)
  //           )
  //         );

  //       return { unreadCount: result.count };
  //     } catch (error) {
  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'Failed to get unread count',
  //       });
  //     }
  //   }),

  // // 删除会话
  // deleteConversation: protectedProcedure
  //   .input(
  //     z.object({
  //       imAccount: z.string(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       // 通过环信账号找到对应用户
  //       const targetUser = await ctx.db.query.iUser.findFirst({
  //         where: eq(iUser.account, parseInt(input.imAccount.replace('iyoloo', ''), 10)),
  //       });

  //       if (!targetUser) {
  //         throw new TRPCError({
  //           code: 'NOT_FOUND',
  //           message: 'User not found',
  //         });
  //       }

  //       // 软删除消息记录
  //       await ctx.db
  //         .update(iMessageUser)
  //         .set({
  //           isDelete: 1,
  //           deleteTime: new Date(),
  //         })
  //         .where(
  //           and(
  //             eq(iMessageUser.fromUserId, ctx.userId),
  //             eq(iMessageUser.toUserId, targetUser.id)
  //           )
  //         );

  //       return { success: true };
  //     } catch (error) {
  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'Failed to delete conversation',
  //       });
  //     }
  //   }),

  // // 标记消息已读
  // markMessagesAsRead: protectedProcedure
  //   .input(
  //     z.object({
  //       fromUserId: z.number(),
  //       messageIds: z.array(z.string()).optional(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       const updateQuery = {
  //         isRead: 1,
  //         updateTime: new Date(),
  //       };

  //       const conditions = [
  //         eq(iMessageUser.toUserId, ctx.userId),
  //         eq(iMessageUser.fromUserId, input.fromUserId),
  //         eq(iMessageUser.isDelete, 0),
  //       ];

  //       // 如果提供了消息ID，则只更新指定消息
  //       if (input.messageIds && input.messageIds.length > 0) {
  //         conditions.push(inArray(iMessageUser.msgId, input.messageIds));
  //       }

  //       await ctx.db
  //         .update(iMessageUser)
  //         .set(updateQuery)
  //         .where(and(...conditions));

  //       return { success: true };
  //     } catch (error) {
  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'Failed to mark messages as read',
  //       });
  //     }
  //   }),

  // // 获取聊天历史记录
  // getChatHistory: protectedProcedure
  //   .input(
  //     z.object({
  //       otherUserId: z.number(),
  //       page: z.number().min(1).default(1),
  //       pageSize: z.number().min(1).max(50).default(20),
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     try {
  //       const messages = await ctx.db.query.iMessageUser.findMany({
  //         where: and(
  //           eq(iMessageUser.isDelete, 0),
  //           sql`(
  //             (from_user_id = ${ctx.userId} AND to_user_id = ${input.otherUserId})
  //             OR
  //             (from_user_id = ${input.otherUserId} AND to_user_id = ${ctx.userId})
  //           )`
  //         ),
  //         orderBy: [desc(iMessageUser.insertTime)],
  //         limit: input.pageSize,
  //         offset: (input.page - 1) * input.pageSize,
  //       });

  //       // 获取总消息数
  //       const [{ total }] = await ctx.db
  //         .select({
  //           total: sql<number>`cast(count(*) as unsigned)`,
  //         })
  //         .from(iMessageUser)
  //         .where(
  //           and(
  //             eq(iMessageUser.isDelete, 0),
  //             sql`(
  //               (from_user_id = ${ctx.userId} AND to_user_id = ${input.otherUserId})
  //               OR
  //               (from_user_id = ${input.otherUserId} AND to_user_id = ${ctx.userId})
  //             )`
  //           )
  //         );

  //       return {
  //         messages,
  //         pagination: {
  //           currentPage: input.page,
  //           pageSize: input.pageSize,
  //           total,
  //           totalPages: Math.ceil(total / input.pageSize),
  //         },
  //       };
  //     } catch (error) {
  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'Failed to fetch chat history',
  //       });
  //     }
  //   }),
});
