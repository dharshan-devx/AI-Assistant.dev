import { users, aiQueries, sessionStats, type User, type InsertUser, type AiQuery, type InsertAiQuery, type SessionStats } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // AI Query methods
  createAiQuery(query: InsertAiQuery): Promise<AiQuery>;
  updateQueryFeedback(id: number, isHelpful: boolean): Promise<AiQuery | undefined>;
  getAiQuery(id: number): Promise<AiQuery | undefined>;
  
  // Session stats methods
  getSessionStats(sessionId: string): Promise<SessionStats | undefined>;
  updateSessionStats(sessionId: string, queriesCount: number, helpfulCount: number): Promise<SessionStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private aiQueries: Map<number, AiQuery>;
  private sessionStats: Map<string, SessionStats>;
  private currentUserId: number;
  private currentQueryId: number;
  private currentStatsId: number;

  constructor() {
    this.users = new Map();
    this.aiQueries = new Map();
    this.sessionStats = new Map();
    this.currentUserId = 1;
    this.currentQueryId = 1;
    this.currentStatsId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createAiQuery(insertQuery: InsertAiQuery): Promise<AiQuery> {
    const id = this.currentQueryId++;
    const query: AiQuery = {
      ...insertQuery,
      id,
      isHelpful: null,
      timestamp: new Date(),
    };
    this.aiQueries.set(id, query);
    return query;
  }

  async updateQueryFeedback(id: number, isHelpful: boolean): Promise<AiQuery | undefined> {
    const query = this.aiQueries.get(id);
    if (query) {
      query.isHelpful = isHelpful;
      this.aiQueries.set(id, query);
      return query;
    }
    return undefined;
  }

  async getAiQuery(id: number): Promise<AiQuery | undefined> {
    return this.aiQueries.get(id);
  }

  async getSessionStats(sessionId: string): Promise<SessionStats | undefined> {
    return this.sessionStats.get(sessionId);
  }

  async updateSessionStats(sessionId: string, queriesCount: number, helpfulCount: number): Promise<SessionStats> {
    const existing = this.sessionStats.get(sessionId);
    if (existing) {
      existing.queriesCount = queriesCount;
      existing.helpfulCount = helpfulCount;
      existing.timestamp = new Date();
      this.sessionStats.set(sessionId, existing);
      return existing;
    } else {
      const id = this.currentStatsId++;
      const stats: SessionStats = {
        id,
        sessionId,
        queriesCount,
        helpfulCount,
        timestamp: new Date(),
      };
      this.sessionStats.set(sessionId, stats);
      return stats;
    }
  }
}

export const storage = new MemStorage();
