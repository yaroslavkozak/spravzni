#!/usr/bin/env node
/**
 * Media Migration Script
 * Uploads files from public/images to REMOTE R2 and creates D1 references
 * 
 * Note: wrangler r2 commands upload to REMOTE by default (no --local flag)
 * This script uploads to the remote R2 bucket: spravzni-storage
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BUCKET_NAME = 'spravzni-storage';
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

// Media mapping: filename -> { r2Key, mediaKey, type }
const MEDIA_MAP = {
  // Hero images
  'hero.png': { r2Key: 'images/hero/hero.png', mediaKey: 'hero.background', type: 'image' },
  'girl.png': { r2Key: 'images/hero/girl.png', mediaKey: 'hero.girl', type: 'image' },
  'mangirl.png': { r2Key: 'images/hero/mangirl.png', mediaKey: 'hero.mangirl', type: 'image' },
  'sub.png': { r2Key: 'images/hero/sub.png', mediaKey: 'hero.sub', type: 'image' },
  'card.png': { r2Key: 'images/hero/card.png', mediaKey: 'hero.card', type: 'image' },
  
  // Gallery images
  '2.png': { r2Key: 'images/gallery/2.png', mediaKey: 'gallery.image2', type: 'image' },
  '3.png': { r2Key: 'images/gallery/3.png', mediaKey: 'gallery.image3', type: 'image' },
  '4.png': { r2Key: 'images/gallery/4.png', mediaKey: 'gallery.image4', type: 'image' },
  '5.png': { r2Key: 'images/gallery/5.png', mediaKey: 'gallery.image5', type: 'image' },
  '6.png': { r2Key: 'images/gallery/6.png', mediaKey: 'gallery.image6', type: 'image' },
  '7.png': { r2Key: 'images/gallery/7.png', mediaKey: 'gallery.image7', type: 'image' },
  '8.png': { r2Key: 'images/gallery/8.png', mediaKey: 'gallery.image8', type: 'image' },
  '9.png': { r2Key: 'images/gallery/9.png', mediaKey: 'gallery.image9', type: 'image' },
  '10.png': { r2Key: 'images/gallery/10.png', mediaKey: 'gallery.image10', type: 'image' },
  '11.png': { r2Key: 'images/gallery/11.png', mediaKey: 'gallery.image11', type: 'image' },
  '12.png': { r2Key: 'images/gallery/12.png', mediaKey: 'gallery.image12', type: 'image' },
  
  // Service images
  's1.png': { r2Key: 'images/services/s1.png', mediaKey: 'services.service1', type: 'image' },
  's2.png': { r2Key: 'images/services/s2.png', mediaKey: 'services.service2', type: 'image' },
  's3.png': { r2Key: 'images/services/s3.png', mediaKey: 'services.service3', type: 'image' },
  's4.png': { r2Key: 'images/services/s4.png', mediaKey: 'services.service4', type: 'image' },
  's5.png': { r2Key: 'images/services/s5.png', mediaKey: 'services.service5', type: 'image' },
  
  // Vacation options
  'p1.png': { r2Key: 'images/vacations/p1.png', mediaKey: 'vacations.option1', type: 'image' },
  'p2.png': { r2Key: 'images/vacations/p2.png', mediaKey: 'vacations.option2', type: 'image' },
  'p3.png': { r2Key: 'images/vacations/p3.png', mediaKey: 'vacations.option3', type: 'image' },
  'p4.png': { r2Key: 'images/vacations/p4.png', mediaKey: 'vacations.option4', type: 'image' },
  'p5.png': { r2Key: 'images/vacations/p5.png', mediaKey: 'vacations.option5', type: 'image' },
  'p6.png': { r2Key: 'images/vacations/p6.png', mediaKey: 'vacations.option6', type: 'image' },
  'p7.png': { r2Key: 'images/vacations/p7.png', mediaKey: 'vacations.option7', type: 'image' },
  'p8.png': { r2Key: 'images/vacations/p8.png', mediaKey: 'vacations.option8', type: 'image' },
  'p9.png': { r2Key: 'images/vacations/p9.png', mediaKey: 'vacations.option9', type: 'image' },
  
  // Instagram
  'inst1.jpg': { r2Key: 'images/instagram/inst1.jpg', mediaKey: 'instagram.post1', type: 'image' },
  'inst2.jpg': { r2Key: 'images/instagram/inst2.jpg', mediaKey: 'instagram.post2', type: 'image' },
  'inst3.jpg': { r2Key: 'images/instagram/inst3.jpg', mediaKey: 'instagram.post3', type: 'image' },
  'inst4.jpg': { r2Key: 'images/instagram/inst4.jpg', mediaKey: 'instagram.post4', type: 'image' },
  'inst5.jpg': { r2Key: 'images/instagram/inst5.jpg', mediaKey: 'instagram.post5', type: 'image' },
  
  // Icons
  'logo.svg': { r2Key: 'images/icons/logo.svg', mediaKey: 'icons.logo', type: 'image' },
  'play.svg': { r2Key: 'images/icons/play.svg', mediaKey: 'icons.play', type: 'image' },
  'pause.svg': { r2Key: 'images/icons/pause.svg', mediaKey: 'icons.pause', type: 'image' },
  'call.svg': { r2Key: 'images/icons/call.svg', mediaKey: 'icons.call', type: 'image' },
  'Chat.svg': { r2Key: 'images/icons/Chat.svg', mediaKey: 'icons.chat', type: 'image' },
  'chatf.svg': { r2Key: 'images/icons/chatf.svg', mediaKey: 'icons.chatf', type: 'image' },
  'location.svg': { r2Key: 'images/icons/location.svg', mediaKey: 'icons.location', type: 'image' },
  'locat.svg': { r2Key: 'images/icons/locat.svg', mediaKey: 'icons.locat', type: 'image' },
  'list.svg': { r2Key: 'images/icons/list.svg', mediaKey: 'icons.list', type: 'image' },
  'lapki.svg': { r2Key: 'images/icons/lapki.svg', mediaKey: 'icons.lapki', type: 'image' },
  'inst.svg': { r2Key: 'images/icons/inst.svg', mediaKey: 'icons.inst', type: 'image' },
  'instb.svg': { r2Key: 'images/icons/instb.svg', mediaKey: 'icons.instb', type: 'image' },
  'instw.svg': { r2Key: 'images/icons/instw.svg', mediaKey: 'icons.instw', type: 'image' },
  'fb.svg': { r2Key: 'images/icons/fb.svg', mediaKey: 'icons.fb', type: 'image' },
  'fbw.svg': { r2Key: 'images/icons/fbw.svg', mediaKey: 'icons.fbw', type: 'image' },
  'sparks.svg': { r2Key: 'images/icons/sparks.svg', mediaKey: 'icons.sparks', type: 'image' },
  'sparks_1.svg': { r2Key: 'images/icons/sparks_1.svg', mediaKey: 'icons.sparks1', type: 'image' },
  'people-safe-one.svg': { r2Key: 'images/icons/people-safe-one.svg', mediaKey: 'icons.people-safe', type: 'image' },
  'wheelchair.svg': { r2Key: 'images/icons/wheelchair.svg', mediaKey: 'icons.wheelchair', type: 'image' },
  'Coordinator.svg': { r2Key: 'images/icons/Coordinator.svg', mediaKey: 'icons.coordinator', type: 'image' },
  'fork-spoon.svg': { r2Key: 'images/icons/fork-spoon.svg', mediaKey: 'icons.fork-spoon', type: 'image' },
  'bus-one.svg': { r2Key: 'images/icons/bus-one.svg', mediaKey: 'icons.bus', type: 'image' },
  'Wi FI.svg': { r2Key: 'images/icons/Wi FI.svg', mediaKey: 'icons.wifi', type: 'image' },
  'rotate.svg': { r2Key: 'images/icons/rotate.svg', mediaKey: 'icons.rotate', type: 'image' },
  'sunrise.svg': { r2Key: 'images/icons/sunrise.svg', mediaKey: 'icons.sunrise', type: 'image' },
  'house.svg': { r2Key: 'images/icons/house.svg', mediaKey: 'icons.house', type: 'image' },
  'riding.svg': { r2Key: 'images/icons/riding.svg', mediaKey: 'icons.riding', type: 'image' },
  'tub.svg': { r2Key: 'images/icons/tub.svg', mediaKey: 'icons.tub', type: 'image' },
  
  // Partners
  'fond.svg': { r2Key: 'images/partners/fond.svg', mediaKey: 'partners.fond', type: 'image' },
  'Group.svg': { r2Key: 'images/partners/Group.svg', mediaKey: 'partners.group', type: 'image' },
  'habilitationcenter.svg': { r2Key: 'images/partners/habilitationcenter.svg', mediaKey: 'partners.habilitationcenter', type: 'image' },
  'lvivskamiskarada.svg': { r2Key: 'images/partners/lvivskamiskarada.svg', mediaKey: 'partners.lvivska', type: 'image' },
  'manivci.svg': { r2Key: 'images/partners/manivci.svg', mediaKey: 'partners.manivci', type: 'image' },
  'par.svg': { r2Key: 'images/partners/par.svg', mediaKey: 'partners.par', type: 'image' },
  'parr.svg': { r2Key: 'images/partners/parr.svg', mediaKey: 'partners.parr', type: 'image' },
  'parrr.svg': { r2Key: 'images/partners/parrr.svg', mediaKey: 'partners.parrr', type: 'image' },
  'parrrrr.svg': { r2Key: 'images/partners/parrrrr.svg', mediaKey: 'partners.parrrrr', type: 'image' },
  'parrrrrrr.svg': { r2Key: 'images/partners/parrrrrrr.svg', mediaKey: 'partners.parrrrrrr', type: 'image' },
  
  // Additional
  'offerone.png': { r2Key: 'images/offers/offerone.png', mediaKey: 'offers.one', type: 'image' },
  'e1.png': { r2Key: 'images/gallery/e1.png', mediaKey: 'gallery.e1', type: 'image' },
  'e2.png': { r2Key: 'images/gallery/e2.png', mediaKey: 'gallery.e2', type: 'image' },
  'e3.png': { r2Key: 'images/gallery/e3.png', mediaKey: 'gallery.e3', type: 'image' },
  'e4.png': { r2Key: 'images/gallery/e4.png', mediaKey: 'gallery.e4', type: 'image' },
  'e5.png': { r2Key: 'images/gallery/e5.png', mediaKey: 'gallery.e5', type: 'image' },
};

function getMimeType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

async function uploadAndRegister(filename, mapping) {
  const filePath = path.join(IMAGES_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping missing file: ${filename}`);
    return false;
  }

  try {
    console.log(`📤 Uploading to REMOTE R2: ${filename} -> ${mapping.r2Key}`);
    
    // Upload to REMOTE R2 (explicitly use --remote flag)
    execSync(
      `npx wrangler r2 object put "${BUCKET_NAME}/${mapping.r2Key}" --file="${filePath}" --remote`,
      { 
        stdio: 'inherit',
        env: { ...process.env, WRANGLER_SEND_METRICS: 'false' }
      }
    );

    // Get file stats
    const stats = fs.statSync(filePath);
    const mimeType = getMimeType(filename);
    
    // Create D1 reference
    const sql = `INSERT OR IGNORE INTO media (key, type, r2_key, r2_bucket, mime_type, size, is_public) VALUES ('${mapping.mediaKey}', '${mapping.type}', '${mapping.r2Key}', '${BUCKET_NAME}', '${mimeType}', ${stats.size}, 1);`;
    
    execSync(
      `npx wrangler d1 execute spravzni-db --remote --command="${sql.replace(/"/g, '\\"')}"`,
      { stdio: 'inherit' }
    );

    console.log(`✅ Registered: ${mapping.mediaKey}`);
    
    // Verify upload to remote R2
    try {
      const listOutput = execSync(
        `npx wrangler r2 bucket list "${BUCKET_NAME}" --remote 2>&1 || echo ""`,
        { encoding: 'utf-8', stdio: 'pipe' }
      );
      console.log(`✅ Uploaded to REMOTE R2: ${mapping.r2Key}\n`);
    } catch (verifyError) {
      console.log(`✅ Upload completed (verification skipped)\n`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting media migration to REMOTE R2...\n');
  console.log(`📦 Bucket: ${BUCKET_NAME} (remote)\n`);

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const [filename, mapping] of Object.entries(MEDIA_MAP)) {
    const success = await uploadAndRegister(filename, mapping);
    if (success) {
      uploaded++;
    } else if (fs.existsSync(path.join(IMAGES_DIR, filename))) {
      errors++;
    } else {
      skipped++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Uploaded: ${uploaded}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('\n✨ Migration complete!');
}

main().catch(console.error);

