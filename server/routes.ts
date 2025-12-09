import type { Express } from "express";
import { createServer, type Server } from "http";

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

async function fetchWithCache(url: string): Promise<any> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchWithCache(url);
    } catch (error: any) {
      if (error.message.includes("429") && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/anime/trending", async (req, res) => {
    try {
      const data = await fetchWithRetry(
        `${JIKAN_BASE_URL}/top/anime?filter=airing&limit=25`
      );
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/anime/popular", async (req, res) => {
    try {
      const data = await fetchWithRetry(
        `${JIKAN_BASE_URL}/top/anime?filter=bypopularity&limit=25`
      );
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/anime/airing", async (req, res) => {
    try {
      const data = await fetchWithRetry(
        `${JIKAN_BASE_URL}/seasons/now?limit=25`
      );
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/anime/upcoming", async (req, res) => {
    try {
      const data = await fetchWithRetry(
        `${JIKAN_BASE_URL}/seasons/upcoming?limit=25`
      );
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/anime/top", async (req, res) => {
    try {
      const filter = req.query.filter || "bypopularity";
      const page = req.query.page || 1;
      const data = await fetchWithRetry(
        `${JIKAN_BASE_URL}/top/anime?filter=${filter}&page=${page}&limit=25`
      );
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/anime/search", async (req, res) => {
    try {
      const q = req.query.q;
      const page = req.query.page || 1;
      if (!q || (typeof q === "string" && q.length < 2)) {
        return res.json({ data: [], pagination: { last_visible_page: 0, has_next_page: false } });
      }
      const data = await fetchWithRetry(
        `${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(q as string)}&page=${page}&limit=24&sfw=true`
      );
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/anime/browse", async (req, res) => {
    try {
      const { genres, type, status, order_by, page = 1 } = req.query;
      let url = `${JIKAN_BASE_URL}/anime?page=${page}&limit=20&sfw=true`;
      
      if (genres) url += `&genres=${genres}`;
      if (type) url += `&type=${type}`;
      if (status) url += `&status=${status}`;
      if (order_by) url += `&order_by=${order_by}&sort=desc`;
      
      const data = await fetchWithRetry(url);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/anime/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = await fetchWithRetry(`${JIKAN_BASE_URL}/anime/${id}/full`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/anime/:id/characters", async (req, res) => {
    try {
      const { id } = req.params;
      const data = await fetchWithRetry(`${JIKAN_BASE_URL}/anime/${id}/characters`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/anime/:id/episodes", async (req, res) => {
    try {
      const { id } = req.params;
      const page = req.query.page || 1;
      const data = await fetchWithRetry(`${JIKAN_BASE_URL}/anime/${id}/episodes?page=${page}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/genres", async (req, res) => {
    try {
      const data = await fetchWithRetry(`${JIKAN_BASE_URL}/genres/anime`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
