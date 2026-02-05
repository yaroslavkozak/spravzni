/**
 * Script to upload media files from /public/images to R2
 * Run with: npx tsx scripts/upload-media-to-r2.ts
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { createMedia } from '../lib/database';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { D1Database, R2Bucket } from '../../types/cloudflare';

interface MediaFile {
  path: string;
  name: string;
  size: number;
  type: 'image' | 'video';
  mimeType: string;
  category: string;
}

// Map old paths to new R2 keys and media keys
const MEDIA_MAPPING: Record<string, { r2Key: string; mediaKey: string; category: string }> = {
  // Hero images
  'hero.png': { r2Key: 'images/hero/hero.png', mediaKey: 'hero.background', category: 'hero' },
  'girl.png': { r2Key: 'images/hero/girl.png', mediaKey: 'hero.girl', category: 'hero' },
  'mangirl.png': { r2Key: 'images/hero/mangirl.png', mediaKey: 'hero.mangirl', category: 'hero' },
  'sub.png': { r2Key: 'images/hero/sub.png', mediaKey: 'hero.sub', category: 'hero' },
  'card.png': { r2Key: 'images/hero/card.png', mediaKey: 'hero.card', category: 'hero' },
  
  // Gallery images
  '2.png': { r2Key: 'images/gallery/2.png', mediaKey: 'gallery.image2', category: 'gallery' },
  '3.png': { r2Key: 'images/gallery/3.png', mediaKey: 'gallery.image3', category: 'gallery' },
  '4.png': { r2Key: 'images/gallery/4.png', mediaKey: 'gallery.image4', category: 'gallery' },
  '5.png': { r2Key: 'images/gallery/5.png', mediaKey: 'gallery.image5', category: 'gallery' },
  '6.png': { r2Key: 'images/gallery/6.png', mediaKey: 'gallery.image6', category: 'gallery' },
  '7.png': { r2Key: 'images/gallery/7.png', mediaKey: 'gallery.image7', category: 'gallery' },
  '8.png': { r2Key: 'images/gallery/8.png', mediaKey: 'gallery.image8', category: 'gallery' },
  '9.png': { r2Key: 'images/gallery/9.png', mediaKey: 'gallery.image9', category: 'gallery' },
  '10.png': { r2Key: 'images/gallery/10.png', mediaKey: 'gallery.image10', category: 'gallery' },
  '11.png': { r2Key: 'images/gallery/11.png', mediaKey: 'gallery.image11', category: 'gallery' },
  '12.png': { r2Key: 'images/gallery/12.png', mediaKey: 'gallery.image12', category: 'gallery' },
  
  // Service images
  's1.png': { r2Key: 'images/services/s1.png', mediaKey: 'services.service1', category: 'services' },
  's2.png': { r2Key: 'images/services/s2.png', mediaKey: 'services.service2', category: 'services' },
  's3.png': { r2Key: 'images/services/s3.png', mediaKey: 'services.service3', category: 'services' },
  's4.png': { r2Key: 'images/services/s4.png', mediaKey: 'services.service4', category: 'services' },
  's5.png': { r2Key: 'images/services/s5.png', mediaKey: 'services.service5', category: 'services' },
  
  // Vacation options
  'p1.png': { r2Key: 'images/vacations/p1.png', mediaKey: 'vacations.option1', category: 'vacations' },
  'p2.png': { r2Key: 'images/vacations/p2.png', mediaKey: 'vacations.option2', category: 'vacations' },
  'p3.png': { r2Key: 'images/vacations/p3.png', mediaKey: 'vacations.option3', category: 'vacations' },
  'p4.png': { r2Key: 'images/vacations/p4.png', mediaKey: 'vacations.option4', category: 'vacations' },
  'p5.png': { r2Key: 'images/vacations/p5.png', mediaKey: 'vacations.option5', category: 'vacations' },
  'p6.png': { r2Key: 'images/vacations/p6.png', mediaKey: 'vacations.option6', category: 'vacations' },
  'p7.png': { r2Key: 'images/vacations/p7.png', mediaKey: 'vacations.option7', category: 'vacations' },
  'p8.png': { r2Key: 'images/vacations/p8.png', mediaKey: 'vacations.option8', category: 'vacations' },
  'p9.png': { r2Key: 'images/vacations/p9.png', mediaKey: 'vacations.option9', category: 'vacations' },
  
  // Instagram
  'inst1.jpg': { r2Key: 'images/instagram/inst1.jpg', mediaKey: 'instagram.post1', category: 'instagram' },
  'inst2.jpg': { r2Key: 'images/instagram/inst2.jpg', mediaKey: 'instagram.post2', category: 'instagram' },
  'inst3.jpg': { r2Key: 'images/instagram/inst3.jpg', mediaKey: 'instagram.post3', category: 'instagram' },
  'inst4.jpg': { r2Key: 'images/instagram/inst4.jpg', mediaKey: 'instagram.post4', category: 'instagram' },
  'inst5.jpg': { r2Key: 'images/instagram/inst5.jpg', mediaKey: 'instagram.post5', category: 'instagram' },
  
  // Icons
  'logo.svg': { r2Key: 'images/icons/logo.svg', mediaKey: 'icons.logo', category: 'icons' },
  'play.svg': { r2Key: 'images/icons/play.svg', mediaKey: 'icons.play', category: 'icons' },
  'pause.svg': { r2Key: 'images/icons/pause.svg', mediaKey: 'icons.pause', category: 'icons' },
  // Add more icons as needed...
};

async function getMimeType(filename: string): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

async function uploadFileToR2(
  bucket: R2Bucket,
  filePath: string,
  r2Key: string,
  mimeType: string
): Promise<void> {
  const fileContent = await readFile(filePath);
  await bucket.put(r2Key, fileContent, {
    httpMetadata: {
      contentType: mimeType,
    },
  });
  console.log(`✅ Uploaded: ${r2Key}`);
}

async function main() {
  console.log('🚀 Starting media migration to R2...\n');

  try {
    // This script should be run in a Cloudflare Workers environment
    // For local testing, you'll need to set up Wrangler
    const context = getCloudflareContext({ async: true });
    const cloudflareEnv = (await context).env as { DB: D1Database; BUCKET: R2Bucket };
    const bucket = cloudflareEnv.BUCKET;
    const db = cloudflareEnv.DB;

    const imagesDir = join(process.cwd(), 'public', 'images');
    const files = await readdir(imagesDir);

    let uploaded = 0;
    let skipped = 0;
    let errors = 0;

    for (const file of files) {
      const mapping = MEDIA_MAPPING[file];
      if (!mapping) {
        console.log(`⏭️  Skipping unmapped file: ${file}`);
        skipped++;
        continue;
      }

      try {
        const filePath = join(imagesDir, file);
        const stats = await stat(filePath);
        const mimeType = await getMimeType(file);

        // Determine type
        const type = mimeType.startsWith('video/') ? 'video' : 'image';

        // Upload to R2
        await uploadFileToR2(bucket, filePath, mapping.r2Key, mimeType);

        // Create D1 reference
        await createMedia(db, {
          key: mapping.mediaKey,
          type,
          r2_key: mapping.r2Key,
          r2_bucket: 'spravzni-storage',
          mime_type: mimeType,
          size: stats.size,
          is_public: true,
        });

        uploaded++;
        console.log(`📝 Created D1 reference: ${mapping.mediaKey}\n`);
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error);
        errors++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Uploaded: ${uploaded}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('\n✨ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Note: This script needs to be run in a Cloudflare Workers context
// For local development, use Wrangler or create an API route
if (require.main === module) {
  main().catch(console.error);
}

