import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const accountRouter = createTRPCRouter({
  // 登录接口
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("邮箱格式不正确"),
        password: z.string().min(6, "密码长度至少为6个字符"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: { email: input.email, password: input.password },
      });

      if (!user) {
        throw new Error("邮箱或密码错误");
      }

      return {
        message: "登录成功",
        user,
      };
    }),

  // 注册接口
  register: publicProcedure
    .input(
      z.object({
        mail: z.string().email("邮箱格式不正确"),
        password: z.string().min(6, "密码长度至少为6个字符"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: { mail: input.mail },
      });

      if (existingUser) {
        throw new Error("邮箱已被注册");
      }

      const newUser = await ctx.db.insert.users.create({
        data: {
          mail: input.mail,
          password: input.password, // 实际项目中请对密码进行加密存储
        },
      });

      return {
        message: "注册成功",
        user: newUser,
      };
    }),

  // 发送验证码接口
  sendCode: publicProcedure
    .input(
      z.object({
        mail: z.string().email("邮箱格式不正确"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 模拟发送验证码逻辑
      const code = Math.floor(100000 + Math.random() * 900000).toString(); // 生成6位数字验证码

      await ctx.db.insert.verificationCodes.create({
        data: {
          mail: input.mail,
          code,
          createdAt: new Date(),
        },
      });

      // 在实际项目中，这里应该调用邮件发送服务，例如 SMTP 或第三方服务
      console.log(`验证码 ${code} 已发送到 ${input.mail}`);

      return {
        message: "验证码已发送",
        mail: input.mail,
      };
    }),

  // 验证验证码接口
  verifyCode: publicProcedure
    .input(
      z.object({
        mail: z.string().email("邮箱格式不正确"),
        code: z.string().length(6, "验证码长度必须为6位"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.db.query.verificationCodes.findFirst({
        where: { mail: input.mail, code: input.code },
        orderBy: { createdAt: "desc" },
      });

      if (!record) {
        throw new Error("验证码错误或已过期");
      }

      return {
        message: "验证码验证成功",
      };
    }),



});
