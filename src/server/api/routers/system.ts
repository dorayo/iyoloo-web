import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  iSystemHobby,
  iSystemLanguage,
  iSystemOccupation,
  iSystemRegion,
} from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export const systemRouter = createTRPCRouter({
  // 获取兴趣爱好列表
  getHobbyList: publicProcedure
    .input(
      z.object({
        language: z.string().optional(),
        type: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(iSystemHobby.isDelete, 0)];

      if (input.language) {
        conditions.push(eq(iSystemHobby.language, input.language));
      }

      if (input.type !== undefined) {
        conditions.push(eq(iSystemHobby.type, input.type));
      }

      const hobbies = await ctx.db.query.iSystemHobby.findMany({
        where: and(...conditions),
        orderBy: (hobby, { asc }) => [asc(hobby.id)],
      });

      return hobbies;
    }),

  // 获取语言列表
  getLanguageList: publicProcedure.query(async ({ ctx }) => {
    const languages = await ctx.db.query.iSystemLanguage.findMany({
      where: eq(iSystemLanguage.isDelete, 0),
      orderBy: (language, { asc }) => [asc(language.id)],
    });

    return languages;
  }),

  // 获取职业列表
  getOccupationList: publicProcedure
    .input(
      z.object({
        language: z.string().optional(),
        type: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(iSystemOccupation.isDelete, 0)];

      if (input.language) {
        conditions.push(eq(iSystemOccupation.language, input.language));
      }

      if (input.type !== undefined) {
        conditions.push(eq(iSystemOccupation.type, input.type));
      }

      const occupations = await ctx.db.query.iSystemOccupation.findMany({
        where: and(...conditions),
        orderBy: (occupation, { asc }) => [asc(occupation.id)],
      });

      return occupations;
    }),

  // 获取地区列表
  getRegionList: publicProcedure
    .input(
      z.object({
        language: z.string().optional(),
        type: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(iSystemRegion.isDelete, 0)];

      if (input.language) {
        conditions.push(eq(iSystemRegion.language, input.language));
      }

      if (input.type !== undefined) {
        conditions.push(eq(iSystemRegion.type, input.type));
      }

      const regions = await ctx.db.query.iSystemRegion.findMany({
        where: and(...conditions),
        orderBy: (region, { asc }) => [asc(region.id)],
      });

      return regions;
    }),
});
