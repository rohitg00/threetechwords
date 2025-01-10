-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  github_id TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  access_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create explanations table
CREATE TABLE IF NOT EXISTS explanations (
  id SERIAL PRIMARY KEY,
  term TEXT NOT NULL,
  responses TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create term_streaks table
CREATE TABLE IF NOT EXISTS term_streaks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  term TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 