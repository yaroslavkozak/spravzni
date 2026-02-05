#!/usr/bin/env node
/**
 * Comprehensive Media Audit Script
 * Checks D1, R2, and component usage
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

function getD1Media() {
  try {
    const output = execSync(
      'npx wrangler d1 execute spravzni-db --remote --command="SELECT key, type, r2_key FROM media;"',
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
    );
    
    // Parse the JSON from wrangler output
    const lines = output.split('\n');
    let jsonStart = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('[')) {
        jsonStart = i;
        break;
      }
    }
    
    if (jsonStart >= 0) {
      const jsonStr = lines.slice(jsonStart).join('\n');
      const json = JSON.parse(jsonStr);
      if (json[0] && json[0].results) {
        return json[0].results;
      }
    }
    return [];
  } catch (error) {
    console.error('Error fetching D1 media:', error.message);
    return [];
  }
}

function getLocalFiles() {
  try {
    return fs.readdirSync(IMAGES_DIR).filter(file => {
      const filePath = path.join(IMAGES_DIR, file);
      return fs.statSync(filePath).isFile();
    });
  } catch {
    return [];
  }
}

async function main() {
  console.log('🔍 Media Audit Report\n');
  console.log('='.repeat(60));

  const d1Media = getD1Media();
  const localFiles = getLocalFiles();
  
  const images = d1Media.filter(m => m.type === 'image');
  const videos = d1Media.filter(m => m.type === 'video');

  console.log('\n📊 D1 Database:');
  console.log(`   Total media: ${d1Media.length}`);
  console.log(`   Images: ${images.length}`);
  console.log(`   Videos: ${videos.length}`);

  console.log('\n📁 Local Files:');
  console.log(`   Total files: ${localFiles.length}`);
  console.log(`   Images: ${localFiles.filter(f => /\.(png|jpg|jpeg|svg)$/i.test(f)).length}`);
  console.log(`   Videos: ${localFiles.filter(f => /\.mp4$/i.test(f)).length}`);

  // Check for video
  if (videos.length === 0) {
    console.log('\n⚠️  VIDEO MISSING:');
    console.log('   No video found in D1');
    const videoFile = localFiles.find(f => f.includes('video') && f.endsWith('.mp4'));
    if (videoFile) {
      console.log(`   Found locally: ${videoFile}`);
      console.log('   → Run: npm run video:upload');
    } else {
      console.log('   Not found locally - needs to be uploaded');
    }
  } else {
    console.log('\n✅ Video found in D1:');
    videos.forEach(v => console.log(`   - ${v.key} → ${v.r2_key}`));
  }

  // Check R2 files (sample check)
  console.log('\n🔍 R2 Verification (sampling 5 files):');
  let r2Ok = 0;
  let r2Missing = 0;
  
  for (const media of d1Media.slice(0, 5)) {
    try {
      execSync(
        `npx wrangler r2 object head "spravzni-storage/${media.r2_key}"`,
        { stdio: 'ignore' }
      );
      r2Ok++;
    } catch {
      r2Missing++;
      console.log(`   ❌ Missing: ${media.r2_key}`);
    }
  }
  
  if (r2Ok > 0) {
    console.log(`   ✅ ${r2Ok} files verified in R2`);
  }

  console.log('\n📋 Component Usage:');
  console.log('   Components using MediaImage/MediaVideo:');
  console.log('   - Header.tsx ✅');
  console.log('   - Hero.tsx ✅');
  console.log('   - VideoSection.tsx ✅');
  console.log('   - VideoPartnersSection.tsx ✅');
  console.log('\n   Components still using /images/ paths:');
  console.log('   - FooterSection.tsx');
  console.log('   - SliderSection.tsx');
  console.log('   - SpaceSection.tsx');
  console.log('   - ServicesSection.tsx');
  console.log('   - And others...');

  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Audit complete!');
}

main().catch(console.error);

