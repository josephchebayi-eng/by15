// Test script to verify Supabase connection
// Run with: node scripts/test-supabase.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL not found in .env.local');
    return;
  }

  if (!supabaseKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
    return;
  }

  console.log('✅ Environment variables found');
  console.log(`📡 URL: ${supabaseUrl.substring(0, 30)}...`);

  try {
    // Create client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created');

    // Test connection by querying secrets table
    const { data, error } = await supabase
      .from('secrets')
      .select('name')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      
      if (error.message.includes('relation "secrets" does not exist')) {
        console.log('\n💡 Tip: Run the SQL setup script in your Supabase dashboard:');
        console.log('   1. Go to SQL Editor in Supabase');
        console.log('   2. Copy contents of scripts/setup-secrets-table.sql');
        console.log('   3. Click "Run"');
      }
      return;
    }

    console.log('✅ Database connection successful');
    console.log('✅ Secrets table accessible');
    console.log(`📊 Found ${data.length} secret(s) in database`);

    // Test inserting a test record
    const { error: insertError } = await supabase
      .from('secrets')
      .upsert({ 
        name: 'test_connection', 
        value: 'test_value_' + Date.now() 
      }, { onConflict: 'name' });

    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message);
    } else {
      console.log('✅ Insert test successful');
      
      // Clean up test record
      await supabase
        .from('secrets')
        .delete()
        .eq('name', 'test_connection');
      console.log('✅ Test cleanup completed');
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }

  console.log('\n🎉 Supabase setup is ready!');
  console.log('   You can now run: pnpm run dev');
}

testSupabaseConnection(); 