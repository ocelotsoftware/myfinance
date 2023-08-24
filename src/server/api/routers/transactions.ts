/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import type { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
  createBank: protectedProcedure
    .input(
      z.object({
        emoji: z.string(),
        name: z.string(),
        description: z.string() || z.null(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.banks.create({
        data: {
          description: input.description,
          emoji: input.emoji,
          name: input.name,
          type: input.type,
          userId: ctx.session.user.id,
        },
      });
      return {
        status: "success",
      };
    }),
  getRecentTransactions: protectedProcedure.query(async ({ ctx }) => {
    const data = await prisma.transactions.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        bank: true,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });
    return data as {
      id: number;
      userId: string;
      description: string | null;
      amount: Decimal;
      bankId: number;
      bank: {
        id: number;
        userId: string;
        name: string;
        description: string;
        emoji: string;
        type: string;
      } | null;
    }[];
  }),
  createNewTransaction: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        bankId: z.number(),
        transferredBankId: z.number().nullable(),
        amount: z.number(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.transferredBankId !== null) {
        await prisma.$transaction([
          prisma.transactions.create({
            data: {
              amount: input.amount * -1,
              accountTransferredToId: input.transferredBankId,
              bankId: input.bankId,
              userId: ctx.session.user.id,
              description: input.description,
            },
          }),
          prisma.transactions.create({
            data: {
              amount: input.amount,
              accountTransferredFromId: input.bankId,
              bankId: input.transferredBankId,
              userId: ctx.session.user.id,
              description: input.description,
            },
          }),
        ]);
      } else {
        await prisma.transactions.create({
          data: {
            amount: input.amount * (input.type === "profit" ? 1 : -1),
            bankId: input.bankId,
            userId: ctx.session.user.id,
            description: input.description,
          },
        });
      }
      return null;
    }),
});
