import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  iUser,
  iUserInfo,
  iUserAccount,
  iUserData,
  iUserAlbum,
} from "~/server/db/schema";
import { and, eq, desc, sql, ne } from "drizzle-orm";
import { createUpdateData } from "~/lib/utils";
import { createEasemobUser } from "~/lib/easemob";

export const userRouter = createTRPCRouter({
  // 首次登录时创建或更新用户信息
  syncUser: protectedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        email: z.string().email(),
        nickname: z.string(),
        avatarUrl: z.string().optional(),
        language: z.string().optional(),
        region: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 查找是否已存在用户记录
      const existingUser = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.email, input.email) && eq(iUser.clerkId, input.clerkId),
      });

      if (existingUser) {
        // 更新现有用户信息
        await ctx.db
          .update(iUser)
          .set({
            lastLoginTime: new Date(),
          })
          .where(eq(iUser.id, existingUser.id));

        return {
          message: "用户信息已更新",
          userId: existingUser.id,
        };
      }

      // 创建新用户
      return await ctx.db.transaction(async (tx) => {
          try {
              // 创建用户基本信息
              const newUser = await tx
                .insert(iUser)
                .values({
                  clerkId: input.clerkId,
                  email: input.email,
                  password: input.clerkId,
                  nickname: input.nickname,
                  avatar: input.avatarUrl,
                  language: input.language ?? "zh-CN",
                  region: input.region,
                  status: 1,
                  type: 2,
                })
                .execute();

              const userId = Number(newUser[0].insertId);
              const accountNumber = userId + 100000;

              // 2. 创建环信账号
              try {
                await createEasemobUser(`iyoloo${accountNumber}`, input.clerkId);
              } catch (error) {
                console.error("创建环信账号失败:", error);
                throw new TRPCError({
                  code: "INTERNAL_SERVER_ERROR",
                  message: "创建环信账号失败",
                  cause: error,
                });
              }

            await tx.update(iUser)
              .set({
                account: userId + 100000,
              })
              .where(eq(iUser.id, userId));

            // 创建用户账户信息
            await tx.insert(iUserAccount as any).values({
              userId: userId,
              goldCoin: "0",
              character: "0",
              vipLevel: "0",
            });

            // 创建用户详细信息
            await tx.insert(iUserInfo).values({
              userId: userId,
            });

            // 创建用户数据统计
            await tx.insert(iUserData).values({
              userId: userId,
            });

          return {
            message: "用户创建成功",
            userId: userId,
          };
        } catch (error) {
          // 如果任何步骤失败，事务会自动回滚
          console.error("创建用户失败:", error);
          throw error;
        }
      });
    }),
  // 获取用户信息 - 公开接口
  getUserInfo: publicProcedure
    .input(
      z.object({
        userId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.id, input.userId),
        with: {
          userInfo: true,
          userAccount: true,
          userData: true,
        },
      });

      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }

      return userInfo;
    }),

  // 获取当前用户信息 - 需要认证
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const userInfo = await ctx.db.query.iUser.findFirst({
      where: eq(iUser.clerkId, ctx.userId),
      with: {
        userInfo: true,
        userAccount: true,
        userData: true,
      },
    });

    if (!userInfo) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "用户不存在",
      });
    }
    // userInfo.imAccount = 'iyoloo' + String(userInfo.account);
    if (userInfo.userInfo?.birthday) {
      userInfo.userInfo.birthday = new Date(userInfo.userInfo.birthday);
    }

    return userInfo;
  }),

  // 更新用户信息 - 需要认证
  updateUserInfo: protectedProcedure
    .input(
      z.object({
        nickname: z.string().optional(),
        avatar: z.string().optional(),
        birthday: z.date().optional(),
        gender: z.number().optional(),
        height: z.number().optional(),
        weight: z.number().optional(),
        region: z.string().optional(),
        language: z.string().optional(),
        occupation: z.string().optional(),
        personalSign: z.string().optional(),
        interest: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });
      //  console.log(444,input)
      const userId = userInfo?.id;

      const updateData = createUpdateData({
        nickname: input.nickname,
        avatar: input.avatar,
        language: input.language,
        region: input.region,
        // 可以轻松添加更多字段
      });

      // // 更新基础信息
      if (Object.keys(updateData).length > 0) {
        await ctx.db.update(iUser).set(updateData).where(eq(iUser.id, userId!));
      }

      const updateData1 = createUpdateData({
        birthday: input.birthday,
        gender: input.gender,
        height: input.height,
        weight: input.weight,
        occupation: input.occupation,
        personalSign: input.personalSign,
        interest: input.interest,
        // 可以轻松添加更多字段
      });
      if (Object.keys(updateData1).length > 0) {
        await ctx.db
          .update(iUserInfo as any)
          .set(updateData1)
          .where(eq(iUserInfo.userId, userId!));
      }

      return {
        message: "更新成功",
      };
    }),

  // 获取用户相册列表
  getUserAlbums: publicProcedure
    .input(
      z.object({
        userId: z.number(), // 目标用户ID
        page: z.number().min(1).default(1), // 页码,默认第1页
        pageSize: z.number().min(1).max(50).default(20), // 每页条数,默认20条,最大50条
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId, page, pageSize } = input;
      const offset = (page - 1) * pageSize;

      // 查询相册列表
      const albums = await ctx.db.query.iUserAlbum.findMany({
        where: and(eq(iUserAlbum.userId, userId), eq(iUserAlbum.isDelete, 0)),
        orderBy: [
          desc(iUserAlbum.top), // 置顶优先
          desc(iUserAlbum.insertTime), // 最新优先
        ],
        offset: offset,
        limit: pageSize,
      });

      // 查询总数用于分页
      const totalCount = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(iUserAlbum)
        .where(and(eq(iUserAlbum.userId, userId), eq(iUserAlbum.isDelete, 0)))
        .then((result) => Number(result[0].count));

      // 计算总页数
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        albums,
        pagination: {
          currentPage: page,
          pageSize,
          totalCount,
          totalPages,
        },
      };
    }),

  // 添加相册
  addAlbum: protectedProcedure
    .input(
      z.object({
        url: z.string().url(), // 图片URL
        top: z.boolean().default(false), // 是否置顶
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 验证用户权限
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "请先登录",
        });
      }

      // 获取用户信息
      const userInfo = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!userInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "用户不存在",
        });
      }

      // 插入相册记录
      const result = await ctx.db
        .insert(iUserAlbum)
        .values({
          userId: userInfo.id,
          url: input.url,
          top: input.top ? 1 : 0,
          ip: "", // 可以从请求中获取
          ipAttribution: "", // 可以从IP获取归属地
          insertTime: new Date(),
          isDelete: 0,
        })
        .execute();

      return {
        success: true,
        message: "上传成功",
        albumId: result[0].insertId,
      };
    }),

  // 获取用户账户信息
  getUserAccount: protectedProcedure.query(async ({ ctx }) => {
    // 先查找用户
    const user = await ctx.db.query.iUser.findFirst({
      where: eq(iUser.clerkId, ctx.userId),
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "用户不存在",
      });
    }

    // 查找账户信息
    const accountInfo = await ctx.db.query.iUserAccount.findFirst({
      where: eq(iUserAccount.userId, user.id),
    });

    if (!accountInfo) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "账户信息不存在",
      });
    }

    return accountInfo;
  }),

  match: protectedProcedure.mutation(async ({ ctx }) => {
    // 1. Get current user info
    const currentUser = await ctx.db.query.iUser.findFirst({
      where: eq(iUser.clerkId, ctx.userId),
      with: {
        userInfo: true,
        userAccount: true,
      },
    });

    if (!currentUser?.userAccount) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "当前用户不存在或信息不完整",
      });
    }

    // 2. Check VIP status and match count
    if (currentUser.userAccount.vipLevel! < 2) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "需要SVIP会员才能使用匹配功能",
      });
    }

    if (currentUser.userAccount.matchCount! <= 0) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "今日匹配次数已用完",
      });
    }

    // 3. Find potential matches - 修改查询逻辑
    const results = await ctx.db
      .select({
        user: iUser,
        userInfo: iUserInfo,
      })
      .from(iUser)
      .innerJoin(iUserInfo, eq(iUser.id, iUserInfo.userId))
      .where(
        and(
          ne(iUser.id, currentUser.id),
          eq(iUser.isDelete, 0),
          eq(iUser.status, 1),
          currentUser.userInfo.gender === 1
            ? eq(iUserInfo.gender, 0)
            : eq(iUserInfo.gender, 1),
        ),
      )
      .orderBy(sql`RAND()`)
      .limit(1);

    console.log("Match results:", results); // 调试日志

    if (results.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "暂无合适的匹配对象",
      });
    }

    const match = results[0];
    const matchCount = currentUser.userAccount.matchCount ?? 0; // 使用空值合并运算符提供默认值
    // 4. Decrease match count
    await ctx.db
      .update(iUserAccount)
      .set({
        matchCount: Math.max(0, matchCount - 1),
      })
      .where(eq(iUserAccount.userId, currentUser.id));

    // 5. Return match result
    return {
      matchedUser: {
        id: match.user.id,
        nickname: match.user.nickname,
        avatar: match.user.avatar,
        region: match.user.region,
        language: match.user.language,
        userInfo: {
          gender: match.userInfo.gender,
          age: match.userInfo.age,
          height: match.userInfo.height,
          weight: match.userInfo.weight,
          occupation: match.userInfo.occupation,
          personalSign: match.userInfo.personalSign,
        },
      },
      remainingCount:Math.max(0, matchCount - 1),
    };
  }),
});
