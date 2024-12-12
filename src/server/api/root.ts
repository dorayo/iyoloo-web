import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { accountRouter } from "~/server/api/routers/account";
import { userRouter } from "~/server/api/routers/user";
import { systemRouter } from "~/server/api/routers/system";
import { relationRouter } from '~/server/api/routers/relation'
import { visitorRouter } from '~/server/api/routers/visitor'
import { mallRouter } from '~/server/api/routers/mall'
import { orderRouter } from '~/server/api/routers/order'
import { goodsRouter } from '~/server/api/routers/goods'
import { rechargeRouter } from '~/server/api/routers/recharge'
import { paymentRouter } from '~/server/api/routers/payment'
import { announcementRouter } from '~/server/api/routers/announcement'
import { notificationRouter } from '~/server/api/routers/notification'
// import { ossRouter } from '~/server/api/routers/oss'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  account: accountRouter,
  user: userRouter,
  system: systemRouter,
  relation: relationRouter,
  visitor: visitorRouter,
  mall: mallRouter,
  order: orderRouter,
  goods: goodsRouter,
  recharge: rechargeRouter,
  payment: paymentRouter,
  announcement: announcementRouter,
  notification: notificationRouter
  // oss: ossRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
