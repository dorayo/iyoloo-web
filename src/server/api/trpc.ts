import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "@clerk/nextjs/server";

import { db } from "~/server/db";

/**
 * 1. CONTEXT
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = auth();
  const { userId } = await auth();

  // console.log('session', session,userId)

  return {
    db,
    auth: session,
    userId: userId,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  // if (t._config.isDev) {
  //   const waitMs = Math.floor(Math.random() * 400) + 100;
  //   await new Promise((resolve) => setTimeout(resolve, waitMs));
  // }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Auth middleware
 */
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "请先登录",
    });
  }

  return next({
    ctx: {
      auth: ctx.auth,
      userId: ctx.userId,
    },
  });
});

/**
 * Public procedure
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(isAuthed);
