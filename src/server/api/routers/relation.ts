// server/api/routers/relation.ts
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  iUserFans,
  iUserFriend,
  iUserFriendName,
  iUser,
  iSystemRegion,
  iSystemLanguage,
} from "~/server/db/schema";
import { and, eq, desc, sql, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const relationRouter = createTRPCRouter({
  // 获取关注列表
  getFollowList: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const offset = (page - 1) * pageSize;

      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId!),
      });
      //  console.log(444,input)
      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }
      const userId = userInfo.id;
      // 获取关注列表
      const follows = await ctx.db.query.iUserFans.findMany({
        where: and(
          eq(iUserFans.userId, userId),
          eq(iUserFans.type, 1),
          eq(iUserFans.isDelete, 0),
        ),
        with: {
          fansUser: {
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
        orderBy: [desc(iUserFans.insertTime)],
      });
      // 获取所有需要的region IDs
      const regionIds = follows
        .map((follow) => follow?.fansUser?.region)
        .filter(Boolean)
        .map(Number);

      // 查询region名称
      const regions = await ctx.db.query.iSystemRegion.findMany({
        where: and(
          eq(iSystemRegion.isDelete, 0),
          inArray(iSystemRegion.id, regionIds),
          // 可以添加语言筛选
          eq(iSystemRegion.language, "zh-CN"),
        ),
      });

      // 构建regionId到name的映射
      const regionMap = regions.reduce(
        (map, region) => {
          if (!region || !region.id || !region.region) return map;
          map[region.id] = region.region;
          return map;
        },
        {} as Record<number, string>,
      );

      // 转换数据，添加region名称
      const enrichedFans = follows.map((follow) => ({
        ...follow,
        fansUser: {
          ...follow.fansUser,
          regionName: follow?.fansUser?.region
            ? regionMap[follow?.fansUser?.region]
            : undefined,
        },
      }));
      // 获取总数
      const [{ total }] = await ctx.db
        .select({
          total: sql<number>`cast(count(*) as unsigned)`,
        })
        .from(iUserFans)
        .where(
          and(
            eq(iUserFans.userId, userId),
            eq(iUserFans.type, 1),
            eq(iUserFans.isDelete, 0),
          ),
        );

      return {
        follows: enrichedFans,
        pagination: {
          currentPage: page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    }),

  // 获取粉丝列表
  getFansList: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const offset = (page - 1) * pageSize;

      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId!),
      });

      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }
      const userId = userInfo.id;

      const fans = await ctx.db.query.iUserFans.findMany({
        where: and(
          eq(iUserFans.fansUserId, userId),
          eq(iUserFans.type, 1),
          eq(iUserFans.isDelete, 0),
        ),
        with: {
          user: {
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
        orderBy: [desc(iUserFans.insertTime)],
      });

      // 获取所有需要的region IDs
      const regionIds = fans
        .map((fan) => fan?.user?.region)
        .filter(Boolean)
        .map(Number);

      // 查询region名称
      const regions = await ctx.db.query.iSystemRegion.findMany({
        where: and(
          eq(iSystemRegion.isDelete, 0),
          inArray(iSystemRegion.id, regionIds),
          // 可以添加语言筛选
          eq(iSystemRegion.language, "zh-CN"),
        ),
      });

      // 构建regionId到name的映射
      const regionMap = regions.reduce(
        (map, region) => {
          if (!region || !region.id || !region.region) return map;
          map[region.id] = region.region;
          return map;
        },
        {} as Record<number, string>,
      );

      // 转换数据，添加region名称
      const enrichedFans = fans.map((fan) => ({
        ...fan,
        user: {
          ...fan.user,
          regionName: fan?.user?.region ? regionMap[fan.user.region] : undefined,
        },
      }));

      const [{ total }] = await ctx.db
        .select({
          total: sql<number>`cast(count(*) as unsigned)`,
        })
        .from(iUserFans)
        .where(
          and(
            eq(iUserFans.fansUserId, userId),
            eq(iUserFans.type, 1),
            eq(iUserFans.isDelete, 0),
          ),
        );

      return {
        fans: enrichedFans,
        pagination: {
          currentPage: page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    }),

  // 关注/取消关注
  toggleFollow: protectedProcedure
    .input(
      z.object({
        targetUserId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }

      // 检查是否已关注
      const existingFollow = await ctx.db.query.iUserFans.findFirst({
        where: and(
          eq(iUserFans.userId, userInfo.id),
          eq(iUserFans.fansUserId, input.targetUserId),
          eq(iUserFans.isDelete, 0),
        ),
      });

      if (existingFollow) {
        // 取消关注
        await ctx.db
          .update(iUserFans)
          .set({
            type: 0,
            updateTime: new Date(),
          })
          .where(eq(iUserFans.id, existingFollow.id));

        return { followed: false };
      } else {
        // 添加关注
        await ctx.db.insert(iUserFans).values({
          userId: userInfo.id,
          fansUserId: input.targetUserId,
          type: 1,
        });

        return { followed: true };
      }
    }),

  // 获取好友列表
  getFriendList: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const offset = (page - 1) * pageSize;

      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }

      const friends = await ctx.db.query.iUserFriend.findMany({
        where: and(
          eq(iUserFriend.userId, userInfo.id),
          eq(iUserFriend.status, 1),
          eq(iUserFriend.isDelete, 0),
        ),
        with: {
          friendUser: {
            columns: {
              id: true,
              account: true,
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
              userAccount: true
            },
          },
          remarkName: true,
        },
        offset,
        limit: pageSize,
        orderBy: [desc(iUserFriend.insertTime)],
      });

      const regionIds = friends
        .map((friend) => friend?.friendUser?.region)
        .filter(Boolean)
        .map(Number);

      // 查询region名称
      const regions = await ctx.db.query.iSystemRegion.findMany({
        where: and(
          eq(iSystemRegion.isDelete, 0),
          inArray(iSystemRegion.id, regionIds),
          // 可以添加语言筛选
          // eq(iSystemRegion.language, 'zh-CN')
        ),
      });
      // 构建regionId到name的映射
      const regionMap = regions.reduce(
        (map, region) => {
          if (!region || !region.id || !region.region) return map;
          map[region.id] = region.region;
          return map;
        },
        {} as Record<number, string>,
      );

      const languageIds = friends
        .map((friend) => friend?.friendUser?.language)
        .filter(Boolean)
        .map(String);

      const languages = await ctx.db.query.iSystemLanguage.findMany({
        where: and(
          eq(iSystemLanguage.isDelete, 0),
          inArray(iSystemLanguage.code, languageIds),
          // eq(iSystemLanguage.language, 'zh-CN')
        ),
      });
      // console.log(555,languages,languageIds);
      // 构建语言映射
      const languageMap = languages.reduce(
        (map, language) => {
          if (language.code && language.language) {
            map[language?.code] = language.language;
          }
          return map;
        },
        {} as Record<string, string>,
      );

      // 转换数据，添加region名称
      const enrichedFans = friends.map((friend) => ({
        ...friend,
        friendUser: {
          ...friend.friendUser,
          regionName: friend?.friendUser?.region
            ? regionMap[friend?.friendUser?.region]
            : undefined,
          languageName: friend?.friendUser?.language
            ? languageMap[friend?.friendUser?.language]
            : undefined,
        },
      }));

      const [{ total }] = await ctx.db
        .select({
          total: sql<number>`cast(count(*) as unsigned)`,
        })
        .from(iUserFriend)
        .where(
          and(
            eq(iUserFriend.userId, userInfo.id),
            eq(iUserFriend.status, 1),
            eq(iUserFriend.isDelete, 0),
          ),
        );

      return {
        friends: enrichedFans,
        pagination: {
          currentPage: page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    }),

  // 添加好友请求
  addFriend: protectedProcedure
    .input(
      z.object({
        targetUserId: z.number(),
        remark: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }

      // 检查是否已经是好友
      const existingFriend = await ctx.db.query.iUserFriend.findFirst({
        where: and(
          eq(iUserFriend.userId, userInfo.id),
          eq(iUserFriend.friendUserId, input.targetUserId),
          eq(iUserFriend.isDelete, 0),
        ),
      });

      if (existingFriend) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "已经是好友关系",
        });
      }

      // 创建好友请求
      await ctx.db.insert(iUserFriend).values({
        userId: userInfo.id,
        friendUserId: input.targetUserId,
        status: -1, // 待审核
        remark: input.remark,
      });

      return { success: true };
    }),

  // 处理好友请求
  handleFriendRequest: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
        accept: z.boolean(),
        remark: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }

      const request = await ctx.db.query.iUserFriend.findFirst({
        where: eq(iUserFriend.id, input.requestId),
      });

      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "请求不存在",
        });
      }

      if (request.friendUserId !== userInfo.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "无权处理该请求",
        });
      }

      if (input.accept) {
        // 接受好友请求
        await ctx.db.transaction(async (tx) => {
          // 更新请求状态
          await tx
            .update(iUserFriend)
            .set({
              status: 1,
              updateTime: new Date(),
            })
            .where(eq(iUserFriend.id, input.requestId));

          // 添加好友备注
          if (input.remark) {
            await tx.insert(iUserFriendName).values({
              userId: userInfo.id,
              friendUserId: request.userId,
              friendRemarkName: input.remark,
            });
          }
        });
      } else {
        // 拒绝好友请求
        await ctx.db
          .update(iUserFriend)
          .set({
            status: 4, // 主动拒绝
            updateTime: new Date(),
          })
          .where(eq(iUserFriend.id, input.requestId));
      }

      return { success: true };
    }),

  // 解除好友关系
  removeFriend: protectedProcedure
    .input(
      z.object({
        friendId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }

      await ctx.db.transaction(async (tx) => {
        // 更新好友关系状态
        await tx
          .update(iUserFriend)
          .set({
            status: 2, // 主动解除
            updateTime: new Date(),
          })
          .where(
            and(
              eq(iUserFriend.userId, userInfo.id),
              eq(iUserFriend.friendUserId, input.friendId),
            ),
          );

        // 删除好友备注
        await tx
          .delete(iUserFriendName)
          .where(
            and(
              eq(iUserFriendName.userId, userInfo.id),
              eq(iUserFriendName.friendUserId, input.friendId),
            ),
          );
      });

      return { success: true };
    }),

  getFriendRequests: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const offset = (page - 1) * pageSize;

      // 获取当前用户信息
      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }

      // 查询待审核的好友申请
      const friendRequests = await ctx.db.query.iUserFriend.findMany({
        where: and(
          eq(iUserFriend.friendUserId, userInfo.id), // 当前用户是被申请人
          eq(iUserFriend.status, -1), // 待审核状态
          eq(iUserFriend.isDelete, 0),
        ),
        with: {
          // 关联查询发起申请的用户信息
          user: {
            columns: {
              id: true,
              nickname: true,
              avatar: true,
              region: true,
              language: true,
            },
            with: {
              userInfo: {
                columns: {
                  personalSign: true,
                },
              },
            },
          },
        },
        offset,
        limit: pageSize,
        orderBy: [desc(iUserFriend.insertTime)],
      });

      // console.log('friendRequests', friendRequests);

      // 获取地区信息
      const regionIds = friendRequests
        .map((req) => req?.user?.region)
        .filter(Boolean).map((id) => Number(id));

      const regions =
        regionIds.length > 0
          ? await ctx.db.query.iSystemRegion.findMany({
              where: and(
                eq(iSystemRegion.isDelete, 0),
                inArray(iSystemRegion.id, regionIds),
                // eq(iSystemRegion.language, 'zh-CN')
              ),
            })
          : [];

      // 构建地区映射
      const regionMap = regions.reduce(
        (map, region) => {
          if (region && region.id != null && region.region != null){
            map[region.id] = region.region;
          }
          return map;
        },
        {} as Record<number, string>,
      );

      // 转换并丰富数据
      const enrichedRequests = friendRequests.map((req) => ({
        id: req.id,
        userId: req?.user?.id,
        name: req?.user?.nickname,
        avatar: req?.user?.avatar,
        personalSign: req?.user?.userInfo?.personalSign,
        region: req?.user?.region,
        regionName: req?.user?.region ? regionMap[req.user.region] || "" : "",
        timestamp: req?.insertTime?.toLocaleString(), // 转换为本地时间字符串
        remark: req.remark || "", // 申请备注
      }));

      // 获取总数
      const [{ total }] = await ctx.db
        .select({
          total: sql<number>`cast(count(*) as unsigned)`,
        })
        .from(iUserFriend)
        .where(
          and(
            eq(iUserFriend.friendUserId, userInfo.id),
            eq(iUserFriend.status, -1),
            eq(iUserFriend.isDelete, 0),
          ),
        );

      return {
        requests: enrichedRequests,
        pagination: {
          currentPage: page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    }),
});
