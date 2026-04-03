import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { and, desc } from "drizzle-orm";
import {
  InsertTransaction,
  accounts,
  cards,
  categories,
  transactions,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all transactions for a user with optional filters
 */
export async function getUserTransactions(
  userId: number,
  options?: { month?: number; year?: number }
) {
  const db = await getDb();
  if (!db) return [];

  let query = db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .$dynamic();

  if (options?.month !== undefined && options?.year !== undefined) {
    query = query.where(
      and(
        eq(transactions.month, options.month),
        eq(transactions.year, options.year)
      )
    );
  }

  return await query.orderBy(desc(transactions.date));
}

/**
 * Get a single transaction
 */
export async function getTransaction(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    .limit(1);

  return result[0];
}

/**
 * Create a transaction
 */
export async function createTransaction(
  userId: number,
  data: Omit<InsertTransaction, 'userId'>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(transactions).values({
    ...data,
    userId,
  });

  return result;
}

/**
 * Update a transaction
 */
export async function updateTransaction(
  id: number,
  userId: number,
  data: Partial<InsertTransaction>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(transactions)
    .set(data)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
}

/**
 * Get all categories for a user
 */
export async function getUserCategories(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(categories.name);
}

/**
 * Get all accounts for a user
 */
export async function getUserAccounts(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId))
    .orderBy(accounts.name);
}

/**
 * Get all cards for a user
 */
export async function getUserCards(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(cards)
    .where(eq(cards.userId, userId))
    .orderBy(cards.name);
}

/**
 * Get or create default categories for a user
 */
export async function ensureDefaultCategories(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const existing = await getUserCategories(userId);
  if (existing.length > 0) return existing;

  const defaultCategories = [
    { name: "Salário", type: "income" as const, color: "#10b981" },
    { name: "Freelance", type: "income" as const, color: "#3b82f6" },
    { name: "Investimentos", type: "income" as const, color: "#8b5cf6" },
    { name: "Alimentação", type: "expense" as const, color: "#f97316" },
    { name: "Transporte", type: "expense" as const, color: "#06b6d4" },
    { name: "Saúde", type: "expense" as const, color: "#ec4899" },
    { name: "Educação", type: "expense" as const, color: "#f59e0b" },
    { name: "Lazer", type: "expense" as const, color: "#a855f7" },
    { name: "Utilidades", type: "expense" as const, color: "#6366f1" },
  ];

  for (const cat of defaultCategories) {
    await db.insert(categories).values({
      userId,
      ...cat,
    });
  }

  return await getUserCategories(userId);
}


