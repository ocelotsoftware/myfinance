import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });
      return user;
    }),
});
