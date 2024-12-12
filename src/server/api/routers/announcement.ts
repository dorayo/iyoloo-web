import { z } from "zod";
import { createTRPCRouter, publicProcedure,protectedProcedure } from "~/server/api/trpc";
import { iMallClassify, iMallGoods, iMessageSystemUser, iMessageSystem, iUser } from "~/server/db/schema";
import { and, eq, desc, asc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const announcementRouter = createTRPCRouter({
  // 获取用户公告列表
  getAnnouncementList: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(10),
        status: z.enum(['unread', 'all']).default('unread'),
        language: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, status, language } = input;
      const offset = (page - 1) * pageSize;

      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId)
      });

      if (!userInfo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '用户不存在'
        });
      }

      const conditions = [
        eq(iMessageSystemUser.userId, userInfo.id),
        eq(iMessageSystemUser.isDelete, 0)
      ];

      if (status === 'unread') {
        conditions.push(eq(iMessageSystemUser.status, 0));
      }

      const announcements = await ctx.db
        .select({
          id: iMessageSystem.id,
          content: iMessageSystem.content,
          url: iMessageSystem.url,
          insertTime: iMessageSystem.insertTime,
          status: iMessageSystemUser.status
        })
        .from(iMessageSystemUser)
        .innerJoin(iMessageSystem, eq(iMessageSystemUser.messageId, iMessageSystem.id))
        .where(and(...conditions))
        .orderBy(desc(iMessageSystem.insertTime))
        .offset(offset)
        .limit(pageSize);

      const [{ total }] = await ctx.db
        .select({ total: sql`count(*)` })
        .from(iMessageSystemUser)
        .where(and(...conditions));

      return {
        announcements,
        pagination: {
          currentPage: page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      };
    }),

  // 标记公告为已读
  markAnnouncementAsRead: protectedProcedure
    .input(
      z.object({
        announcementId: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId)
      });

      if (!userInfo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '用户不存在'
        });
      }

      await ctx.db.update(iMessageSystemUser)
        .set({
          status: 1,
          updateTime: new Date()
        })
        .where(
          and(
            eq(iMessageSystemUser.messageId, input.announcementId),
            eq(iMessageSystemUser.userId, userInfo.id)
          )
        );

      return { success: true };
    })
});