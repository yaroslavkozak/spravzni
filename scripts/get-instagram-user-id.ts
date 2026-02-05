#!/usr/bin/env bun

/**
 * Script to get Instagram User ID from an access token
 * Usage: bun scripts/get-instagram-user-id.ts <access_token>
 */

const accessToken = process.argv[2];

if (!accessToken) {
  console.error('❌ Error: Access token is required');
  console.log('\nUsage: bun scripts/get-instagram-user-id.ts <access_token>');
  console.log('\nExample:');
  console.log('  bun scripts/get-instagram-user-id.ts IGAAKnCuxsEmZABZAFk0NDVkQ2RlQkJEOU5ieTNETURONHdZAbC1wZAW5MQ3NXZAFVXR2IxcGJiazdyTDZApeFR5blBTMHBZAcUZAhRVNyVnhpYzJUTDZA6NmdVZAnFoZAmF6X1V5WThiQUdUSUEzQXhLdVZAGN0xmQ05IM3QxbG1qVmNCNC03RQZDZD');
  process.exit(1);
}

async function getInstagramUserId(token: string) {
  try {
    console.log('🔍 Fetching Instagram User ID...\n');
    
    // First, try to get user info from Instagram Graph API
    const url = `https://graph.instagram.com/me?fields=id,username&access_token=${token}`;
    
    console.log('📡 Making request to Instagram Graph API...');
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error:', errorData);
      
      if (response.status === 401) {
        console.error('\n⚠️  Token may be expired or invalid.');
        console.error('   Please check your access token.');
      }
      
      throw new Error(`Instagram API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('\n✅ Success! Here are your Instagram details:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 Instagram User ID:', data.id);
    console.log('👤 Username:', data.username || 'N/A');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 Next steps:');
    console.log('   1. Copy the Instagram User ID above');
    console.log('   2. Set it as a Cloudflare secret:');
    console.log('      wrangler secret put INSTAGRAM_USER_ID');
    console.log('   3. Set your access token:');
    console.log('      wrangler secret put INSTAGRAM_ACCESS_TOKEN');
    console.log('\n');
    
    return data.id;
  } catch (error) {
    console.error('\n❌ Failed to get Instagram User ID:', error);
    console.error('\n💡 Troubleshooting:');
    console.error('   - Verify your access token is valid');
    console.error('   - Check that your Instagram account is Business/Creator');
    console.error('   - Ensure the token has required permissions');
    process.exit(1);
  }
}

getInstagramUserId(accessToken);
