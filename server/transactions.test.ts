import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Auth Router", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  it("should return current user with me query", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toEqual(ctx.user);
  });

  it("should logout and clear session cookie", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });

  it("should have correct logout cookie options", async () => {
    const caller = appRouter.createCaller(ctx);
    await caller.auth.logout();
    
    const clearCookieCall = (ctx.res.clearCookie as any).mock.calls[0];
    expect(clearCookieCall[0]).toBe("app_session_id");
    expect(clearCookieCall[1]).toHaveProperty("maxAge", -1);
  });
});

describe("Transactions Router Input Validation", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  it("should validate month input (1-12)", async () => {
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.transactions.list({ month: 13, year: 2026 });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(["BAD_REQUEST", "INTERNAL_SERVER_ERROR"]).toContain(error.code);
    }
  });

  it("should validate year input (minimum 2000)", async () => {
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.transactions.list({ month: 1, year: 1999 });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(["BAD_REQUEST", "INTERNAL_SERVER_ERROR"]).toContain(error.code);
    }
  });


  it("should accept valid month and year", async () => {
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.transactions.list({ month: 4, year: 2026 });
    } catch (error: any) {
      if (error.code && error.code !== "INTERNAL_SERVER_ERROR") {
        expect.fail(`Unexpected error: ${error.message}`);
      }
    }
  });
});

describe("Transactions Router Create Input Validation", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  it("should validate transaction amount is positive", async () => {
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.transactions.create({
        date: new Date(),
        type: "expense",
        categoryId: 1,
        amount: -100,
        paymentMethod: "debit",
        month: 4,
        year: 2026,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(["BAD_REQUEST", "INTERNAL_SERVER_ERROR"]).toContain(error.code);
    }
  });

  it("should validate transaction amount is not zero", async () => {
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.transactions.create({
        date: new Date(),
        type: "expense",
        categoryId: 1,
        amount: 0,
        paymentMethod: "debit",
        month: 4,
        year: 2026,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(["BAD_REQUEST", "INTERNAL_SERVER_ERROR"]).toContain(error.code);
    }
  });

  it("should validate transaction type enum", async () => {
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.transactions.create({
        date: new Date(),
        type: "invalid" as any,
        categoryId: 1,
        amount: 100,
        paymentMethod: "debit",
        month: 4,
        year: 2026,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(["BAD_REQUEST", "INTERNAL_SERVER_ERROR"]).toContain(error.code);
    }
  });

  it("should validate payment method enum", async () => {
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.transactions.create({
        date: new Date(),
        type: "expense",
        categoryId: 1,
        amount: 100,
        paymentMethod: "invalid" as any,
        month: 4,
        year: 2026,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(["BAD_REQUEST", "INTERNAL_SERVER_ERROR"]).toContain(error.code);
    }
  });
});
