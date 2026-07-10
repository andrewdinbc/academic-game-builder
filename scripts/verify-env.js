// Quick env verification script
console.log('Environment Variables Status:');
console.log('================================');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_ANTHROPIC_API_KEY',
];

const optionalVars = [
  'UPSTASH_REDIS_URL',
  'NEXT_PUBLIC_BREVO_API_KEY',
];

console.log('\n✓ REQUIRED (must be set):');
requiredVars.forEach(v => {
  const value = process.env[v];
  const status = value ? '✓' : '✗';
  const display = value ? `${value.substring(0, 20)}...` : 'MISSING';
  console.log(`  ${status} ${v}: ${display}`);
});

console.log('\n◐ OPTIONAL (nice to have):');
optionalVars.forEach(v => {
  const value = process.env[v];
  const status = value ? '✓' : '○';
  const display = value ? `${value.substring(0, 20)}...` : 'not set';
  console.log(`  ${status} ${v}: ${display}`);
});
