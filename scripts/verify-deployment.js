#!/usr/bin/env node

/**
 * Deployment verification script
 * Run: node scripts/verify-deployment.js
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_ANTHROPIC_API_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'BREVO_API_KEY'
];

console.log('🔍 Checking Environment Variables...\n');

let allSet = true;
requiredEnvVars.forEach(varName => {
  const isSet = !!process.env[varName];
  const status = isSet ? '✅' : '❌';
  console.log(`${status} ${varName}: ${isSet ? 'SET' : 'MISSING'}`);
  if (!isSet) allSet = false;
});

console.log('\n' + (allSet ? '✅ All env vars configured!' : '❌ Some env vars missing!'));
process.exit(allSet ? 0 : 1);
