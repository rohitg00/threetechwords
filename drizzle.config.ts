import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  out: "./migrations",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: "aws-0-ap-south-1.pooler.supabase.com",
    port: 5432,
    user: "postgres.dueteepapzwchwnycqwk",
    password: "AITechExplainer123",
    database: "postgres",
    ssl: {
      rejectUnauthorized: false
    }
  },
  verbose: true,
  strict: true,
});
