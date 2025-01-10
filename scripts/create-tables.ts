import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

async function createTables() {
  try {
    // Create tables using REST API
    const { error } = await supabase.from('_tables').select('*');
    
    if (error) {
      console.error('Error accessing database:', error);
      return;
    }

    // Create users table
    const { error: usersError } = await supabase.from('users').select('*').limit(1);
    if (usersError?.code === 'PGRST204') {
      console.log('Creating users table...');
      const { error: createError } = await supabase.from('users').insert([]).select();
      if (createError) {
        console.error('Error creating users table:', createError);
      } else {
        console.log('Users table created successfully');
      }
    } else {
      console.log('Users table already exists');
    }

    // Create explanations table
    const { error: explanationsError } = await supabase.from('explanations').select('*').limit(1);
    if (explanationsError?.code === 'PGRST204') {
      console.log('Creating explanations table...');
      const { error: createError } = await supabase.from('explanations').insert([]).select();
      if (createError) {
        console.error('Error creating explanations table:', createError);
      } else {
        console.log('Explanations table created successfully');
      }
    } else {
      console.log('Explanations table already exists');
    }

    // Create term_streaks table
    const { error: streaksError } = await supabase.from('term_streaks').select('*').limit(1);
    if (streaksError?.code === 'PGRST204') {
      console.log('Creating term_streaks table...');
      const { error: createError } = await supabase.from('term_streaks').insert([]).select();
      if (createError) {
        console.error('Error creating term_streaks table:', createError);
      } else {
        console.log('Term streaks table created successfully');
      }
    } else {
      console.log('Term streaks table already exists');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

createTables(); 