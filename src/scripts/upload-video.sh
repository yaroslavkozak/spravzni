#!/bin/bash
# Script to upload video to R2 and create D1 reference

VIDEO_FILE="public/images/videoone.mp4"
R2_KEY="videos/videoone.mp4"
MEDIA_KEY="videos.hero"
BUCKET_NAME="spravzni-storage"

if [ ! -f "$VIDEO_FILE" ]; then
    echo "❌ Video file not found at: $VIDEO_FILE"
    echo "📝 Please place videoone.mp4 in public/images/ directory"
    echo "   Or update VIDEO_FILE variable in this script"
    exit 1
fi

echo "🚀 Uploading video to R2..."

# Get file size
if [[ "$OSTYPE" == "darwin"* ]]; then
    FILE_SIZE=$(stat -f%z "$VIDEO_FILE")
else
    FILE_SIZE=$(stat -c%s "$VIDEO_FILE")
fi

# Upload to REMOTE R2
echo "📤 Uploading to REMOTE R2..."
npx wrangler r2 object put "$BUCKET_NAME/$R2_KEY" --file="$VIDEO_FILE" --remote

if [ $? -eq 0 ]; then
    echo "✅ Video uploaded to R2"
    
    # Create D1 reference
    echo "📝 Creating D1 reference..."
    SQL="INSERT OR IGNORE INTO media (key, type, r2_key, r2_bucket, mime_type, size, is_public) VALUES ('$MEDIA_KEY', 'video', '$R2_KEY', '$BUCKET_NAME', 'video/mp4', $FILE_SIZE, 1);"
    
    npx wrangler d1 execute spravzni-db --remote --command="$SQL"
    
    if [ $? -eq 0 ]; then
        echo "✅ D1 reference created"
        echo ""
        echo "✨ Video migration complete!"
        echo "   Media Key: $MEDIA_KEY"
        echo "   R2 Key: $R2_KEY"
        echo "   File Size: $FILE_SIZE bytes"
    else
        echo "❌ Failed to create D1 reference"
    fi
else
    echo "❌ Failed to upload video to R2"
    exit 1
fi

