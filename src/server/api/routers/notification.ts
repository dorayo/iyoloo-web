// server/api/routers/notification.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { iUserInteract, iUser } from "~/server/db/schema";
import { and, eq, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const notificationRouter = createTRPCRouter({
  getNotifications: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId)
      });

      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const { page, pageSize } = input;
      const offset = (page - 1) * pageSize;

      // Fetch notifications
      const notifications = await ctx.db.query.iUserInteract.findMany({
        where: and(
          eq(iUserInteract.userId, userInfo.id),
          eq(iUserInteract.isDelete, 0)
        ),
        with: {
          otherUser: true
        },
        orderBy: [desc(iUserInteract.insertTime)],
        offset,
        limit: pageSize,
      });

      // Get total count
      const [{ total }] = await ctx.db
        .select({
          total: sql<number>`cast(count(*) as unsigned)`,
        })
        .from(iUserInteract)
        .where(
          and(
            eq(iUserInteract.userId, userInfo.id),
            eq(iUserInteract.isDelete, 0)
          )
        );

      return {
        notifications: notifications.map(notification => ({
          ...notification,
          otherUser: {
            id: notification.otherUser.id,
            nickname: notification.otherUser.nickname,
            avatar: notification.otherUser.avatar,
          }
        })),
        pagination: {
          currentPage: page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    }),

  // The rest of the router remains the same
  markAsRead: protectedProcedure
    .input(
      z.object({
        notificationId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(iUserInteract)
        .set({
          isRead: 1,
          updateTime: new Date(),
        })
        .where(eq(iUserInteract.id, input.notificationId));

      return { success: true };
    }),

  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId)
      });

      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      await ctx.db
        .update(iUserInteract)
        .set({
          isRead: 1,
          updateTime: new Date(),
        })
        .where(
          and(
            eq(iUserInteract.userId, userInfo.id),
            eq(iUserInteract.isRead, 0)
          )
        );

      return { success: true };
    }),
});