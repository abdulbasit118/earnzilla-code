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

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Ad Watches
  createAdWatch(adWatch: InsertAdWatch): Promise<AdWatch>;
  getAdWatchesByUser(userId: number): Promise<AdWatch[]>;
  
  // Spins
  createSpin(spin: InsertSpin): Promise<Spin>;
  getSpinsByUser(userId: number): Promise<Spin[]>;
  
  // Referrals
  createReferral(referral: InsertReferral): Promise<Referral>;
  getReferralsByReferrer(referrerId: number): Promise<Referral[]>;
  
  // Leaderboard
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  updateLeaderboard(entry: InsertLeaderboard): Promise<LeaderboardEntry>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private adWatches: Map<number, AdWatch>;
  private spins: Map<number, Spin>;
  private referrals: Map<number, Referral>;
  private leaderboard: Map<number, LeaderboardEntry>;
  private currentUserId: number;
  private currentAdWatchId: number;
  private currentSpinId: number;
  private currentReferralId: number;
  private currentLeaderboardId: number;

  constructor() {
    this.users = new Map();
    this.adWatches = new Map();
    this.spins = new Map();
    this.referrals = new Map();
    this.leaderboard = new Map();
    this.currentUserId = 1;
    this.currentAdWatchId = 1;
    this.currentSpinId = 1;
    this.currentReferralId = 1;
    this.currentLeaderboardId = 1;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid
    );
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.referralCode === referralCode
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Ad Watches
  async createAdWatch(insertAdWatch: InsertAdWatch): Promise<AdWatch> {
    const id = this.currentAdWatchId++;
    const adWatch: AdWatch = { 
      ...insertAdWatch, 
      id,
      watchedAt: new Date()
    };
    this.adWatches.set(id, adWatch);
    return adWatch;
  }

  async getAdWatchesByUser(userId: number): Promise<AdWatch[]> {
    return Array.from(this.adWatches.values()).filter(
      (adWatch) => adWatch.userId === userId
    );
  }

  // Spins
  async createSpin(insertSpin: InsertSpin): Promise<Spin> {
    const id = this.currentSpinId++;
    const spin: Spin = { 
      ...insertSpin, 
      id,
      spunAt: new Date()
    };
    this.spins.set(id, spin);
    return spin;
  }

  async getSpinsByUser(userId: number): Promise<Spin[]> {
    return Array.from(this.spins.values()).filter(
      (spin) => spin.userId === userId
    );
  }

  // Referrals
  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const id = this.currentReferralId++;
    const referral: Referral = { 
      ...insertReferral, 
      id,
      createdAt: new Date()
    };
    this.referrals.set(id, referral);
    return referral;
  }

  async getReferralsByReferrer(referrerId: number): Promise<Referral[]> {
    return Array.from(this.referrals.values()).filter(
      (referral) => referral.referrerId === referrerId
    );
  }

  // Leaderboard
  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    return Array.from(this.leaderboard.values())
      .sort((a, b) => Number(b.weeklyEarnings) - Number(a.weeklyEarnings))
      .slice(0, limit);
  }

  async updateLeaderboard(insertEntry: InsertLeaderboard): Promise<LeaderboardEntry> {
    const id = this.currentLeaderboardId++;
    const entry: LeaderboardEntry = { 
      ...insertEntry, 
      id,
      createdAt: new Date()
    };
    this.leaderboard.set(id, entry);
    return entry;
  }
}

import { DatabaseStorage } from "./dbStorage";

export const storage = new DatabaseStorage();
