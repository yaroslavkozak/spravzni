/**
 * Script to create the first admin user
 * 
 * Usage:
 *   bun run scripts/create-admin-user.ts <email> <password> [name]
 * 
 * Example:
 *   bun run scripts/create-admin-user.ts admin@example.com mypassword123 "Admin Name"
 */

import { createAdminUser } from '../src/lib/database/admin-auth'

// This script would need to be run with access to the database
// For Cloudflare Workers, you might need to use wrangler d1 execute
// or create an API endpoint for initial admin creation

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.error('Usage: bun run scripts/create-admin-user.ts <email> <password> [name]')
    process.exit(1)
  }

  const [email, password, name] = args

  console.log('Creating admin user...')
  console.log('Email:', email)
  console.log('Name:', name || 'Not provided')

  // Note: This script requires database access
  // In a Cloudflare Workers environment, you would need to:
  // 1. Use wrangler d1 execute to run SQL directly, OR
  // 2. Create a one-time setup API endpoint that can be called once
  // 3. Use Cloudflare D1 console to insert the user manually

  console.log('\nTo create an admin user in Cloudflare D1:')
  console.log('1. Use the Cloudflare dashboard D1 console, OR')
  console.log('2. Run the migration: bun run db:migrate --file=./migrations/009_add_admin_users.sql')
  console.log('3. Use wrangler d1 execute to insert a user with a hashed password')
  console.log('\nOr create an API endpoint for initial setup that can be called once.')
}

main().catch(console.error)
