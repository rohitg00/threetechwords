import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { type Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { users, type SelectUser } from "@db/schema";
import { db } from "@db";

// extend express user object with our schema
declare global {
  namespace Express {
    interface User extends SelectUser { }
  }
}

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {},
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionSettings.cookie = {
      secure: true,
    };
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    throw new Error('GitHub OAuth credentials are required');
  }

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const { data: user, error } = await db
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? `${process.env.PRODUCTION_URL}/api/auth/github/callback`
      : 'http://localhost:5001/api/auth/github/callback',
    scope: ['user:email']
  },
  async function(accessToken: string, refreshToken: string, profile: any, done: any) {
    try {
      // Get user's primary email
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

      // Check if user exists
      const { data: existingUsers, error: findError } = await db
        .from('users')
        .select('*')
        .eq('github_id', profile.id)
        .limit(1);

      if (findError) throw findError;

      if (existingUsers && existingUsers.length > 0) {
        // Update existing user with latest info including email
        const { error: updateError } = await db
          .from('users')
          .update({
            username: profile.username,
            email: email,
            avatar_url: profile._json.avatar_url,
            access_token: accessToken
          })
          .eq('id', existingUsers[0].id);

        if (updateError) throw updateError;
        return done(null, existingUsers[0]);
      }

      // Create new user with email
      const { data: newUser, error: insertError } = await db
        .from('users')
        .insert({
          github_id: profile.id,
          username: profile.username,
          email: email,
          avatar_url: profile._json.avatar_url,
          access_token: accessToken
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }));

  // Auth routes
  app.get('/api/auth/github',
    passport.authenticate('github'));

  app.get('/api/auth/github/callback',
    passport.authenticate('github', { 
      failureRedirect: '/',
      successRedirect: '/'
    }));

  app.get('/api/auth/logout', (req: any, res: any) => {
    req.logout(() => {
      res.redirect('/');
    });
  });

  app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    res.status(401).send("Not logged in");
  });
}
