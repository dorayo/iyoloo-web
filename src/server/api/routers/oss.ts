// server/api/routers/oss.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import crypto from "crypto";
import { env } from "~/env";

interface OSCredentials {
  accessKeyId: string;
  policy: string;
  signature: string;
  key: string;
  ossHost: string;
  success_action_status: string;
}

export const ossRouter = createTRPCRouter({
  getUploadCredentials: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<OSCredentials> => {
      // 生成OSS策略
      const date = new Date();
      date.setHours(date.getHours() + 1);
      const expiration = date.toISOString();

      // 生成文件路径
      const fileExt = input.fileName.split(".").pop();
      const key = `avatars/${Date.now()}.${fileExt}`;

      // 生成策略
      const policyConfig = {
        expiration,
        conditions: [
          ["content-length-range", 0, 5242880], // 5MB限制
          ["starts-with", "$key", "avatars/"],
          { bucket: env.OSS_BUCKET },
        ],
      };

      const policy = Buffer.from(JSON.stringify(policyConfig)).toString(
        "base64",
      );

      // 生成签名
      const signature = crypto
        .createHmac("sha1", env.OSS_ACCESS_KEY_SECRET)
        .update(policy)
        .digest("base64");

      return {
        accessKeyId: env.OSS_ACCESS_KEY_ID,
        policy,
        signature,
        key,
        ossHost: `https://${env.OSS_BUCKET}.${env.OSS_REGION}.aliyuncs.com`,
        success_action_status: "200",
      };
    }),
});
