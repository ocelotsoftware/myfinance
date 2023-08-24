/* eslint-disable @typescript-eslint/no-unsafe-call */
import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { transactionRouter } from "./routers/transactions";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  transactions: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
