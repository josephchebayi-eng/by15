// Debug script to check environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Environment Variables Debug:\n');

const vars = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  'SUPABASE_URL': process.env.SUPABASE_URL,
  'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY,
};

Object.entries(vars).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const displayValue = value ? `${value.substring(0, 20)}...` : 'NOT SET';
  console.log(`${status} ${key}: ${displayValue}`);
});

console.log('\n📋 Summary:');
console.log(`- Supabase URL: ${vars.NEXT_PUBLIC_SUPABASE_URL || vars.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`- Anon Key: ${vars.NEXT_PUBLIC_SUPABASE_ANON_KEY || vars.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`- Service Role Key: ${vars.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}`);

if (!vars.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('\n🚨 MISSING SERVICE ROLE KEY!');
  console.log('To fix this:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Navigate to Settings → API');
  console.log('3. Copy the "service_role" key');
  console.log('4. Add it to your .env.local file as:');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here');
} 