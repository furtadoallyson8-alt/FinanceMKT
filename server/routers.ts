import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

// Import database helpers
import { getUserTransactions, getUserCategories, getUserAccounts, getUserCards, createTransaction, updateTransaction, deleteTransaction, ensureDefaultCategories } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  transactions: router({
    list: protectedProcedure
      .input(
        z.object({
          month: z.number().int().min(1).max(12).optional(),
          year: z.number().int().min(2000).optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        const txns = await db.getUserTransactions(ctx.user.id, {
          month: input.month,
          year: input.year,
        });
        return txns;
      }),

    create: protectedProcedure
      .input(
        z.object({
          date: z.date(),
          type: z.enum(["income", "expense"]),
          categoryId: z.number().int(),
          description: z.string().max(500).optional(),
          amount: z.number().int().positive(),
          paymentMethod: z.enum(["cash", "debit", "credit", "transfer", "other"]),
          accountId: z.number().int().optional(),
          cardId: z.number().int().optional(),
          month: z.number().int().min(1).max(12),
          year: z.number().int().min(2000),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createTransaction(ctx.user.id, input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number().int(),
          date: z.date().optional(),
          type: z.enum(["income", "expense"]).optional(),
          categoryId: z.number().int().optional(),
          description: z.string().max(500).optional(),
          amount: z.number().int().positive().optional(),
          paymentMethod: z.enum(["cash", "debit", "credit", "transfer", "other"]).optional(),
          accountId: z.number().int().optional(),
          cardId: z.number().int().optional(),
          month: z.number().int().min(1).max(12).optional(),
          year: z.number().int().min(2000).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateTransaction(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteTransaction(input.id, ctx.user.id);
      }),
  }),

  categories: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      await db.ensureDefaultCategories(ctx.user.id);
      return await db.getUserCategories(ctx.user.id);
    }),
  }),

  accounts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserAccounts(ctx.user.id);
    }),
  }),

  cards: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserCards(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;

// Re-export for use in procedures
export { protectedProcedure, publicProcedure };
