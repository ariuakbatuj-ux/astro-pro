// ============================================================================
// GENERATE BCRYPT PASSWORD HASH
// Run this file with: node generate-password-hash.js
// ============================================================================

import bcrypt from 'bcryptjs';

const passwords = [
  { label: 'admin123', value: 'admin123' },
  { label: 'password123', value: 'password123' },
  { label: 'test123', value: 'test123' },
  { label: 'ariuka (your password)', value: 'ariuka123' }, // Change this to your actual password
];

console.log('🔐 Generating Bcrypt Password Hashes...\n');
console.log('Copy these hashes to use in SQL UPDATE statements:\n');

for (const pwd of passwords) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(pwd.value, salt);
  
  console.log(`Password: ${pwd.label}`);
  console.log(`Hash: ${hash}`);
  console.log(`SQL: UPDATE users SET password = '${hash}' WHERE username = 'your_username';\n`);
}

console.log('✅ Done! Use these hashes in your SQL UPDATE statements.\n');
console.log('Example:');
console.log("UPDATE users SET password = '<hash_here>' WHERE username = 'ariuka';");
