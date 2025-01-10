import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { getExplanations } from "./services/ai";
import { db } from "@db";
import { explanations, termStreaks } from "@db/schema";
import { ExplanationRequest, Mode } from "./types";

export function setupRoutes(app: Express): Server {
  const server = createServer(app);

  // API routes
  app.post('/api/explain', async (req, res) => {
    try {
      const { term, mode } = req.body as ExplanationRequest;
      const explanations = await getExplanations(term, mode as Mode);

      // Update term streak if user is authenticated
      if (req.isAuthenticated() && req.user?.id) {
        // Find existing streak
        const { data: existingStreaks, error: findError } = await db
          .from('term_streaks')
          .select('*')
          .eq('user_id', req.user.id)
          .eq('term', term.toLowerCase())
          .limit(1);

        if (findError) throw findError;

        if (existingStreaks && existingStreaks.length > 0) {
          // Update existing streak
          const { error: updateError } = await db
            .from('term_streaks')
            .update({
              count: existingStreaks[0].count + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingStreaks[0].id);

          if (updateError) throw updateError;
        } else {
          // Create new streak
          const { error: insertError } = await db
            .from('term_streaks')
            .insert({
              user_id: req.user.id,
              term: term.toLowerCase(),
              count: 1,
              updated_at: new Date().toISOString()
            });

          if (insertError) throw insertError;
        }
      }

      res.json(explanations);
    } catch (error) {
      console.error('Error getting explanation:', error);
      res.status(500).json({ error: 'Failed to generate explanation' });
    }
  });

  // Get user's term streaks
  app.get('/api/streaks', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const { data: streaks, error } = await db
        .from('term_streaks')
        .select('*')
        .eq('user_id', req.user!.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      res.json(streaks);
    } catch (error) {
      console.error('Error getting streaks:', error);
      res.status(500).json({ error: 'Failed to get streaks' });
    }
  });

  return server;
}