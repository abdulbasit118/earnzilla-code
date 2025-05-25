import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  referralCode: text("referral_code").notNull().unique(),
  usedReferralCode: text("used_referral_code"),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
  totalAdsWatched: integer("total_ads_watched").default(0),
  referralCount: integer("referral_count").default(0),
  badges: text("badges").array().default([]),
  lastSpinDate: timestamp("last_spin_date"),
  dailyAdsToday: integer("daily_ads_today").default(0),
  lastAdDate: timestamp("last_ad_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adWatches = pgTable("ad_watches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  earnings: decimal("earnings", { precision: 10, scale: 2 }),
  watchedAt: timestamp("watched_at").defaultNow(),
});

export const spins = pgTable("spins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  prize: decimal("prize", { precision: 10, scale: 2 }),
  spunAt: timestamp("spun_at").defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").references(() => users.id),
  referredId: integer("referred_id").references(() => users.id),
  earnings: decimal("earnings", { precision: 10, scale: 2 }).default("50"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  weeklyEarnings: decimal("weekly_earnings", { precision: 10, scale: 2 }).default("0"),
  rank: integer("rank"),
  weekStarting: timestamp("week_starting"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdWatchSchema = createInsertSchema(adWatches).omit({
  id: true,
  watchedAt: true,
});

export const insertSpinSchema = createInsertSchema(spins).omit({
  id: true,
  spunAt: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAdWatch = z.infer<typeof insertAdWatchSchema>;
export type AdWatch = typeof adWatches.$inferSelect;
export type InsertSpin = z.infer<typeof insertSpinSchema>;
export type Spin = typeof spins.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
