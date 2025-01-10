import { drizzle } from "drizzle-orm/postgres-js";
import { createClient } from "@supabase/supabase-js";
import * as schema from "./schema";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase credentials");
}

// Create Supabase client
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Test connection function
export async function testConnection() {
  try {
    // Test connection with a simple query
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      throw error;
    }
    console.log("Successfully connected to Supabase database");
    return true;
  } catch (error) {
    console.error("Error connecting to database:", error);
    return false;
  }
}

// Export database client
export const db = supabase;
