import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { iUserInteract, iUser } from "~/server/db/schema";
import { and, eq, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const notificationRouter = createTRPCRouter({
  getNotifications: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        pageSize: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.pageSize;
      const cursor = input.cursor;

      const user = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const notifications = await ctx.db.query.iUserInteract.findMany({
        where: and(
          eq(iUserInteract.userId, user.id),
          eq(iUserInteract.isDelete, 0),
          cursor ? sql`id < ${cursor}` : undefined,
        ),
        with: {
          otherUser: {
            columns: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
        },
        limit: limit + 1,
        orderBy: [desc(iUserInteract.id)],
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (notifications.length > limit) {
        const nextItem = notifications.pop();
        nextCursor = nextItem?.id;
      }

      return {
        notifications,
        nextCursor,
      };
    }),

  markAsRead: protectedProcedure
    .input(
      z.object({
        notificationId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!user) {
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
            eq(iUserInteract.id, input.notificationId),
            eq(iUserInteract.userId, user.id),
          ),
        );

      return { success: true };
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.query.iUser.findFirst({
      where: eq(iUser.clerkId, ctx.userId),
    });

    if (!user) {
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
        and(eq(iUserInteract.userId, user.id), eq(iUserInteract.isRead, 0)),
      );

    return { success: true };
  }),
});
