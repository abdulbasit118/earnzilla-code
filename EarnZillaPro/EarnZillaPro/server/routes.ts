import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertAdWatchSchema,
  insertSpinSchema,
  insertReferralSchema,
  insertLeaderboardSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.get("/api/users/:firebaseUid", async (req, res) => {
    try {
      const { firebaseUid } = req.params;
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = await storage.updateUser(parseInt(id), updates);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Ad watch routes
  app.post("/api/ad-watches", async (req, res) => {
    try {
      const adWatchData = insertAdWatchSchema.parse(req.body);
      const adWatch = await storage.createAdWatch(adWatchData);
      res.status(201).json(adWatch);
    } catch (error) {
      res.status(400).json({ message: "Invalid ad watch data" });
    }
  });

  app.get("/api/ad-watches/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const adWatches = await storage.getAdWatchesByUser(parseInt(userId));
      res.json(adWatches);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Spin routes
  app.post("/api/spins", async (req, res) => {
    try {
      const spinData = insertSpinSchema.parse(req.body);
      const spin = await storage.createSpin(spinData);
      res.status(201).json(spin);
    } catch (error) {
      res.status(400).json({ message: "Invalid spin data" });
    }
  });

  app.get("/api/spins/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const spins = await storage.getSpinsByUser(parseInt(userId));
      res.json(spins);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Referral routes
  app.post("/api/referrals", async (req, res) => {
    try {
      const referralData = insertReferralSchema.parse(req.body);
      const referral = await storage.createReferral(referralData);
      res.status(201).json(referral);
    } catch (error) {
      res.status(400).json({ message: "Invalid referral data" });
    }
  });

  app.get("/api/referrals/referrer/:referrerId", async (req, res) => {
    try {
      const { referrerId } = req.params;
      const referrals = await storage.getReferralsByReferrer(parseInt(referrerId));
      res.json(referrals);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/referral-code/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const user = await storage.getUserByReferralCode(code);
      
      if (!user) {
        return res.status(404).json({ message: "Invalid referral code" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/leaderboard", async (req, res) => {
    try {
      const leaderboardData = insertLeaderboardSchema.parse(req.body);
      const entry = await storage.updateLeaderboard(leaderboardData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid leaderboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
