import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { iMallClassify, iMallGoods } from "~/server/db/schema";
import { and, eq, desc, asc, sql } from "drizzle-orm";

export const mallRouter = createTRPCRouter({
  // 获取分类列表
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.query.iMallClassify.findMany({
      where: eq(iMallClassify.isDelete, 0),
      orderBy: [asc(iMallClassify.id)],
    });

    return categories;
  }),

  // 获取商品列表
  getProducts: publicProcedure
    .input(
      z.object({
        classifyId: z.number().optional(), // 可选的分类ID筛选
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(20),
        sortBy: z.enum(['price_asc', 'price_desc', 'newest']).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { classifyId, page, pageSize, sortBy } = input;
      const offset = (page - 1) * pageSize;

      // 构建查询条件
      const conditions = [
        eq(iMallGoods.isDelete, 0),
        eq(iMallGoods.status, 1), // 只查询上架商品
      ];

      if (classifyId) {
        conditions.push(eq(iMallGoods.classifyId, classifyId));
      }

      // 构建排序条件
      let orderBy = [];
      if (sortBy === 'price_asc') {
        orderBy.push(asc(iMallGoods.price));
      } else if (sortBy === 'price_desc') {
        orderBy.push(desc(iMallGoods.price));
      } else {
        // 默认按最新排序
        orderBy.push(desc(iMallGoods.insertTime));
      }

      // 获取商品列表
      const products = await ctx.db.query.iMallGoods.findMany({
        where: and(...conditions),
        with: {
          category: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
        limit: pageSize,
        offset,
        orderBy,
      });

      // 获取总数
      const [{ count }] = await ctx.db
        .select({
          count: sql<number>`cast(count(*) as unsigned)`,
        })
        .from(iMallGoods)
        .where(and(...conditions));

      return {
        products,
        pagination: {
          currentPage: page,
          pageSize,
          total: count,
          totalPages: Math.ceil(count / pageSize),
        },
      };
    }),

  // 获取单个商品详情
  getProductDetail: publicProcedure
    .input(z.object({
      productId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.query.iMallGoods.findFirst({
        where: and(
          eq(iMallGoods.id, input.productId),
          eq(iMallGoods.isDelete, 0),
          eq(iMallGoods.status, 1)
        ),
        with: {
          category: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '商品不存在或已下架',
        });
      }

      return product;
    }),
});