/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";

export const transactionRouter = createTRPCRouter({
  totalAmount: protectedProcedure.query(async ({ ctx }) => {
    try {
      const money = await prisma.transactions.aggregate({
        _sum: {
          amount: true,
        },
        _count: {
          amount: true,
        },
        where: {
          userId: ctx.session.user.id,
        },
      });
      return {
        sum: money._sum.amount,
        count: money._count.amount,
      } as {
        sum: number | null;
        count: number | null;
      };
    } catch (e) {
      return null;
    }
  }),
  getAllBanks: protectedProcedure.query(async ({ ctx }) => {
    const banks = await prisma.banks.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return banks as
      | {
          id: number;
          userId: string;
          name: string;
          description: string;
          emoji: string;
        }[]
      | null;
  }),
});
