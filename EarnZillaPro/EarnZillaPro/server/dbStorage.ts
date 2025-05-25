import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { 
  users, 
  adWatches, 
  spins, 
  referrals, 
  leaderboard,
  type User, 
  type InsertUser,
  type AdWatch,
  type InsertAdWatch,
  type Spin,
  type InsertSpin,
  type Referral,
  type InsertReferral,
  type LeaderboardEntry,
  type InsertLeaderboard
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid)).limit(1);
    return result[0];
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.referralCode, referralCode)).limit(1);
    return result[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Ad Watches
  async createAdWatch(adWatchData: InsertAdWatch): Promise<AdWatch> {
    const result = await db.insert(adWatches).values(adWatchData).returning();
    return result[0];
  }

  async getAdWatchesByUser(userId: number): Promise<AdWatch[]> {
    return await db.select().from(adWatches).where(eq(adWatches.userId, userId));
  }

  // Spins
  async createSpin(spinData: InsertSpin): Promise<Spin> {
    const result = await db.insert(spins).values(spinData).returning();
    return result[0];
  }

  async getSpinsByUser(userId: number): Promise<Spin[]> {
    return await db.select().from(spins).where(eq(spins.userId, userId));
  }

  // Referrals
  async createReferral(referralData: InsertReferral): Promise<Referral> {
    const result = await db.insert(referrals).values(referralData).returning();
    return result[0];
  }

  async getReferralsByReferrer(referrerId: number): Promise<Referral[]> {
    return await db.select().from(referrals).where(eq(referrals.referrerId, referrerId));
  }

  // Leaderboard
  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    return await db.select().from(leaderboard)
      .orderBy(desc(leaderboard.weeklyEarnings))
      .limit(limit);
  }

  async updateLeaderboard(entryData: InsertLeaderboard): Promise<LeaderboardEntry> {
    const result = await db.insert(leaderboard).values(entryData).returning();
    return result[0];
  }
}