// server/api/routers/goods.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { iGoodsVip, iGoodsGoldCoin, iGoodsTranslate } from "~/server/db/schema";
import { and, eq, asc, desc } from "drizzle-orm";

export const goodsRouter = createTRPCRouter({
  // 获取VIP充值选项
  getVipOptions: publicProcedure
    .input(
      z.object({
        vipLevel: z.number().optional(), // 可选参数，用于筛选VIP等级
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(iGoodsVip.isDelete, 0)];
      conditions.push(eq(iGoodsVip.brand, 'iyoloo')); // 只查询启用的选项
      if (input.vipLevel !== undefined) {
        conditions.push(eq(iGoodsVip.vipLevel, input.vipLevel));
      }

      const options = await ctx.db.query.iGoodsVip.findMany({
        where: and(...conditions),
        orderBy: [
          asc(iGoodsVip.month), // 按月份升序
          asc(iGoodsVip.amount) // 同月份按价格升序
        ],
      });

      return options;
    }),

  // 获取金币充值选项
  getGoldCoinOptions: publicProcedure.query(async ({ ctx }) => {
    const options = await ctx.db.query.iGoodsGoldCoin.findMany({
      where: and(
        eq(iGoodsGoldCoin.isDelete, 0),
        eq(iGoodsGoldCoin.brand, 'iyoloo')
      ),
      orderBy: [
        asc(iGoodsGoldCoin.goldCoin), // 按金币数量升序
      ],
    });

    return options.map(option => ({
      ...option,
      // 计算总金币数(包含赠送)
      totalGoldCoin: option.goldCoin + (option.giveGoldCoin || 0)
    }));
  }),

  // 获取翻译包充值选项
  getTranslateOptions: publicProcedure.query(async ({ ctx }) => {
    const options = await ctx.db.query.iGoodsTranslate.findMany({
      where: and(
        eq(iGoodsTranslate.isDelete, 0),
        eq(iGoodsTranslate.brand, 'iyoloo')
      ),
      orderBy: [
        asc(iGoodsTranslate.character), // 按字符数量升序
      ],
    });

    return options;
  }),

  // 获取所有充值选项(一次性获取所有类型)
  getAllOptions: publicProcedure
    .input(
      z.object({
        vipLevel: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [vipOptions, goldCoinOptions, translateOptions] = await Promise.all([
        // 查询VIP选项
        ctx.db.query.iGoodsVip.findMany({
          where: and(
            eq(iGoodsVip.isDelete, 0),
            input.vipLevel ? eq(iGoodsVip.vipLevel, input.vipLevel) : undefined
          ),
          orderBy: [asc(iGoodsVip.month)],
        }),
        
        // 查询金币选项
        ctx.db.query.iGoodsGoldCoin.findMany({
          where: eq(iGoodsGoldCoin.isDelete, 0),
          orderBy: [asc(iGoodsGoldCoin.goldCoin)],
        }),
        
        // 查询翻译包选项
        ctx.db.query.iGoodsTranslate.findMany({
          where: eq(iGoodsTranslate.isDelete, 0),
          orderBy: [asc(iGoodsTranslate.character)],
        }),
      ]);

      return {
        vip: vipOptions,
        goldCoin: goldCoinOptions.map(option => ({
          ...option,
          totalGoldCoin: option.goldCoin + (option.giveGoldCoin || 0)
        })),
        translate: translateOptions,
      };
    }),
});