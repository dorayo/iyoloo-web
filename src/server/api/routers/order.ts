import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { iMallOrder, iUser, iUserAccount } from "~/server/db/schema";
import { and, eq, desc, sql } from "drizzle-orm";

export const orderRouter = createTRPCRouter({
  // Create a new order
  createOrder: protectedProcedure
    .input(
      z.object({
        goodsId: z.number(),
        quantity: z.number().min(1),
        recipientType: z.enum(["self", "friend"]),
        recipientUserId: z.number().optional(),
        shippingAddress: z.string().optional(),
        shippingPhone: z.string().optional(),
        message: z.string().optional(),
        paymentMethod: z.enum(["gold_coin"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get current user
      const currentUser = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
        with: {
          userAccount: true,
        },
      });

      if (!currentUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Get product details
      const product = await ctx.db.query.iMallGoods.findFirst({
        where: eq(iMallGoods.id, input.goodsId),
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Calculate total amount
      const totalAmount = product.price * input.quantity;

      // Verify user has enough gold coins
      if (currentUser.userAccount.goldCoin < totalAmount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient gold coins",
        });
      }

      // If sending to friend, verify friend exists
      let recipientUser = null;
      if (input.recipientType === "friend" && input.recipientUserId) {
        recipientUser = await ctx.db.query.iUser.findFirst({
          where: eq(iUser.id, input.recipientUserId),
        });

        if (!recipientUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Recipient not found",
          });
        }
      }

      // Create order in transaction
      return await ctx.db.transaction(async (tx) => {
        // Create order
        const [order] = await tx.insert(iMallOrder).values({
          goodsId: input.goodsId,
          goodsName: product.name,
          goodsPrice: product.price,
          goodsSum: input.quantity,
          buyUserId: currentUser.id,
          buyNickname: currentUser.nickname,
          operation: input.recipientType === "friend" ? 1 : 0,
          recipientUserId: input.recipientType === "friend" ? input.recipientUserId : currentUser.id,
          recipientNickname: input.recipientType === "friend" ? recipientUser?.nickname : currentUser.nickname,
          recipientPhone: input.shippingPhone,
          shippingAddress: input.shippingAddress,
          remake: input.message,
          payType: 4, // Gold coins
          amount: totalAmount,
          status: 1,
          payTime: new Date(),
        });

        // Deduct gold coins
        await tx.update(iUserAccount)
          .set({
            goldCoin: currentUser.userAccount.goldCoin - totalAmount,
          })
          .where(eq(iUserAccount.userId, currentUser.id));

        return {
          orderId: order.insertId,
          message: "Order created successfully",
        };
      });
    }),

  // Get orders where user is buyer
  getPurchasedOrders: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const offset = (page - 1) * pageSize;

      // Get current user
      const currentUser = await ctx.db.query.iUser.findFirst({
        where: eq(iUser.clerkId, ctx.userId),
      });

      if (!currentUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Get orders
      const orders = await ctx.db.query.iMallOrder.findMany({
        where: and(
          eq(iMallOrder.buyUserId, currentUser.id),
          eq(iMallOrder.isDelete, 0),
          eq(iMallOrder.status, 2)
        ),
        with: {
          goods: true,
          recipient: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
        offset,
        limit: pageSize,
        orderBy: [desc(iMallOrder.insertTime)],
      });

      // Get total count
      const [{ count }] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(iMallOrder)
        .where(
          and(
            eq(iMallOrder.buyUserId, currentUser.id),
            eq(iMallOrder.isDelete, 0),
            eq(iMallOrder.status, 2)
          )
        );

      return {
        orders,
        pagination: {
          currentPage: page,
          pageSize,
          total: count,
          totalPages: Math.ceil(count / pageSize),
        },
      };
    }),

  // Get orders where user is recipient
    getReceivedOrders: protectedProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(50).default(10),
        })
      )
      .query(async ({ ctx, input }) => {
        const { page, pageSize } = input;
        const offset = (page - 1) * pageSize;

        // Get current user
        const currentUser = await ctx.db.query.iUser.findFirst({
          where: eq(iUser.clerkId, ctx.userId),
        });

        if (!currentUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Get orders
        const orders = await ctx.db.query.iMallOrder.findMany({
          where: and(
            eq(iMallOrder.recipientUserId, currentUser.id),
            eq(iMallOrder.isDelete, 0),
            eq(iMallOrder.status, 2)
          ),
          with: {
            goods: true,
            buyer: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
          offset,
          limit: pageSize,
          orderBy: [desc(iMallOrder.insertTime)],
        });

        // Get total count
        const [{ count }] = await ctx.db
          .select({ count: sql<number>`count(*)` })
          .from(iMallOrder)
          .where(
            and(
              eq(iMallOrder.recipientUserId, currentUser.id),
              eq(iMallOrder.isDelete, 0),
              eq(iMallOrder.status, 2)
            )
          );

        return {
          orders,
          pagination: {
            currentPage: page,
            pageSize,
            total: count,
            totalPages: Math.ceil(count / pageSize),
          },
        };
      }),

});