#!/usr/bin/env node
/**
 * Media Verification Script
 * Checks what's in D1, what's in public/images, and what's missing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

// Get all files in public/images
function getLocalFiles() {
  try {
    return fs.readdirSync(IMAGES_DIR).filter(file => {
      const filePath = path.join(IMAGES_DIR, file);
      return fs.statSync(filePath).isFile();
    });
  } catch (error) {
    console.error('Error reading images directory:', error);
    return [];
  }
}

// Get media from D1
function getD1Media() {
  try {
    const output = execSync(
      'npx wrangler d1 execute spravzni-db --remote --command="SELECT key, type, r2_key FROM media;"',
      { encoding: 'utf-8' }
    );
    
    const json = JSON.parse(output);
    if (json[0] && json[0].results) {
      return json[0].results;
    }
    return [];
  } catch (error) {
    console.error('Error fetching D1 media:', error);
    return [];
  }
}

// Check if file exists in R2 (by trying to get it)
function checkR2File(r2Key) {
  try {
    execSync(
      `npx wrangler r2 object head "spravzni-storage/${r2Key}"`,
      { stdio: 'ignore' }
    );
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🔍 Verifying media migration...\n');

  const localFiles = getLocalFiles();
  const d1Media = getD1Media();
  
  console.log(`📁 Local files: ${localFiles.length}`);
  console.log(`💾 D1 references: ${d1Media.length}\n`);

  // Create maps
  const d1ByKey = {};
  const d1ByR2Key = {};
  d1Media.forEach(media => {
    d1ByKey[media.key] = media;
    d1ByR2Key[media.r2_key] = media;
  });

  // Check for missing video
  const videoInD1 = d1Media.find(m => m.type === 'video');
  if (!videoInD1) {
    console.log('⚠️  Video not found in D1');
    const videoFile = localFiles.find(f => f.includes('video') && f.endsWith('.mp4'));
    if (videoFile) {
      console.log(`   Found local video: ${videoFile}`);
      console.log('   Run: npm run video:upload');
    } else {
      console.log('   No video file found locally');
    }
    console.log('');
  }

  // Check images
  const imageFiles = localFiles.filter(f => 
    f.match(/\.(png|jpg|jpeg|svg)$/i)
  );

  console.log('📊 Media Status:\n');
  
  let missingInD1 = 0;
  let missingInR2 = 0;
  let allGood = 0;

  for (const file of imageFiles) {
    // Find corresponding D1 entry
    const media = d1Media.find(m => {
      const r2FileName = m.r2_key.split('/').pop();
      return r2FileName === file;
    });

    if (!media) {
      console.log(`❌ ${file} - Not in D1`);
      missingInD1++;
    } else {
      // Check if in R2
      const inR2 = checkR2File(media.r2_key);
      if (!inR2) {
        console.log(`⚠️  ${file} - In D1 but not in R2 (${media.r2_key})`);
        missingInR2++;
      } else {
        allGood++;
      }
    }
  }

  console.log(`\n✅ All good: ${allGood}`);
  console.log(`❌ Missing in D1: ${missingInD1}`);
  console.log(`⚠️  Missing in R2: ${missingInR2}`);

  // Summary
  console.log('\n📋 Summary:');
  console.log(`   Total local files: ${localFiles.length}`);
  console.log(`   Total D1 references: ${d1Media.length}`);
  console.log(`   Images in D1: ${d1Media.filter(m => m.type === 'image').length}`);
  console.log(`   Videos in D1: ${d1Media.filter(m => m.type === 'video').length}`);
}

main().catch(console.error);

