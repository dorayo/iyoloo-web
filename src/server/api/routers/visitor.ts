// server/api/routers/visitor.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { iUserVisitor, iSystemRegion, iUser } from "~/server/db/schema";
import { and, eq, desc, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const visitorRouter = createTRPCRouter({
  // 获取访客列表
  getVisitorList: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(20),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, startDate, endDate } = input;
      const offset = (page - 1) * pageSize;

      // 获取当前用户
      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }

      // 构建查询条件
      const conditions = [
        eq(iUserVisitor.userId, userInfo.id),
        eq(iUserVisitor.isDelete, 0),
      ];

      // 添加日期筛选
      if (startDate) {
        conditions.push(sql`DATE(${iUserVisitor.date}) >= DATE(${startDate})`);
      }
      if (endDate) {
        conditions.push(sql`DATE(${iUserVisitor.date}) <= DATE(${endDate})`);
      }

      // 获取访客列表
      const visitors = await ctx.db.query.iUserVisitor.findMany({
        where: and(...conditions),
        with: {
          visitor: {
            columns: {
              id: true,
              nickname: true,
              avatar: true,
              region: true,
              language: true,
              onlineState: true,
            },
            with: {
              userInfo: {
                columns: {
                  gender: true,
                },
              },
            },
          },
        },
        offset,
        limit: pageSize,
        orderBy: [desc(iUserVisitor.date)],
      });

      // 获取所有需要的region IDs
      const regionIds = visitors
        .map((visitor) => visitor?.visitor?.region)
        .filter(Boolean)
        .map(Number); // 将字符串转换为数字

      // 查询region名称
      const regions = await ctx.db.query.iSystemRegion.findMany({
        where: and(
          eq(iSystemRegion.isDelete, 0),
          inArray(iSystemRegion.id, regionIds),
          eq(iSystemRegion.language, "zh-CN"),
        ),
      });

      // 构建regionId到name的映射
      const regionMap = regions.reduce(
        (map, region) => {
          if (region && region.id != null && region.region != null) {
            map[region.id] = region.region;
          }
          return map;
        },
        {} as Record<number, string>,
      );

      // 转换数据，添加region名称
      const enrichedVisitors = visitors.map((visitor) => ({
        ...visitor,
        visitor: {
          ...visitor.visitor,
          regionName: visitor?.visitor?.region
            ? regionMap[visitor?.visitor?.region]
            : undefined,
        },
      }));

      // 按日期分组
      // 安全地按日期分组
      const groupedVisitors = enrichedVisitors.reduce(
        (groups, visitor) => {
          try {
            // 使用insertTime而不是date字段
            const date = visitor.insertTime
              ? new Date(visitor.insertTime).toISOString().split("T")[0]
              : "unknown";

            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(visitor);
          } catch (error) {
            console.error("Error processing visitor date:", error);
            // 将无效日期的访客放入"unknown"组
            if (!groups.unknown) {
              groups.unknown = [];
            }
            groups.unknown.push(visitor);
          }
          return groups;
        },
        {} as Record<string, typeof enrichedVisitors>,
      );

      // 获取总数
      const [{ total }] = await ctx.db
        .select({
          total: sql<number>`cast(count(*) as unsigned)`,
        })
        .from(iUserVisitor)
        .where(and(...conditions));

      // 更新未读状态
      await ctx.db
        .update(iUserVisitor)
        .set({
          isRead: 1,
          updateTime: new Date(),
        })
        .where(
          and(eq(iUserVisitor.userId, userInfo.id), eq(iUserVisitor.isRead, 0)),
        );

      return {
        visitors: groupedVisitors,
        pagination: {
          currentPage: page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    }),

  // 获取未读访客数量
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const userInfo = await ctx.db.query.iUser.findFirst({
      where: eq(iUser.clerkId, ctx.userId),
    });

    if (!userInfo) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "用户不存在",
      });
    }

    const [{ count }] = await ctx.db
      .select({
        count: sql<number>`cast(count(*) as unsigned)`,
      })
      .from(iUserVisitor)
      .where(
        and(
          eq(iUserVisitor.userId, userInfo.id),
          eq(iUserVisitor.isRead, 0),
          eq(iUserVisitor.isDelete, 0),
        ),
      );

    return { count };
  }),
});
