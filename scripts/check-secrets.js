// Script to check what's in the secrets table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkSecretsTable() {
  console.log('🔍 Checking secrets table...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if secrets table exists
    const { data: allSecrets, error } = await supabase
      .from('secrets')
      .select('*');

    if (error) {
      console.error('❌ Error querying secrets table:', error.message);
      
      if (error.message.includes('relation "secrets" does not exist')) {
        console.log('\n💡 The secrets table does not exist!');
        console.log('You need to run the SQL setup script:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and paste the contents of scripts/setup-secrets-table.sql');
        console.log('4. Click "Run"');
      }
      return;
    }

    console.log(`📊 Found ${allSecrets.length} secret(s) in the database:`);
    
    if (allSecrets.length === 0) {
      console.log('❌ No secrets found - the table is empty');
      console.log('\n💡 You need to add API keys through the admin interface:');
      console.log('1. Visit http://localhost:3000/admin/api-keys');
      console.log('2. Add your OpenAI API key');
      console.log('3. Add your OpenRouter API key (optional)');
    } else {
      allSecrets.forEach((secret, index) => {
        console.log(`${index + 1}. ${secret.name}: ${secret.value ? '✅ Set' : '❌ Empty'}`);
        if (secret.value) {
          console.log(`   Length: ${secret.value.length} characters`);
          console.log(`   Preview: ${secret.value.substring(0, 10)}...`);
        }
      });
    }

    // Check for specific keys
    const openaiKey = allSecrets.find(s => s.name === 'openai_api_key');
    const openrouterKey = allSecrets.find(s => s.name === 'openrouter_api_key');

    console.log('\n📋 Key Status:');
    console.log(`OpenAI API Key: ${openaiKey && openaiKey.value ? '✅ Configured' : '❌ Missing'}`);
    console.log(`OpenRouter API Key: ${openrouterKey && openrouterKey.value ? '✅ Configured' : '❌ Missing'}`);

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

checkSecretsTable(); 