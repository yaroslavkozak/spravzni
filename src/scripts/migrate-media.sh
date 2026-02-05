#!/bin/bash
# Media Migration Script
# Uploads files from public/images to R2 and creates D1 references

set -e

BUCKET_NAME="spravzni-storage"
IMAGES_DIR="public/images"

echo "🚀 Starting media migration to R2..."

# Function to upload file and create D1 reference
upload_and_register() {
    local file=$1
    local r2_key=$2
    local media_key=$3
    local file_type=$4
    
    echo "📤 Uploading: $file -> $r2_key"
    
    # Upload to REMOTE R2
    npx wrangler r2 object put "spravzni-storage/$r2_key" --file="$IMAGES_DIR/$file" --remote || {
        echo "❌ Failed to upload $file"
        return 1
    }
    
    # Get file info
    local mime_type=""
    local extension="${file##*.}"
    case "$extension" in
        png) mime_type="image/png" ;;
        jpg|jpeg) mime_type="image/jpeg" ;;
        svg) mime_type="image/svg+xml" ;;
        mp4) mime_type="video/mp4" ;;
        *) mime_type="application/octet-stream" ;;
    esac
    
    local file_size=$(stat -f%z "$IMAGES_DIR/$file" 2>/dev/null || stat -c%s "$IMAGES_DIR/$file" 2>/dev/null || echo "0")
    
    # Create D1 reference
    local sql="INSERT INTO media (key, type, r2_key, r2_bucket, mime_type, size, is_public) VALUES ('$media_key', '$file_type', '$r2_key', 'spravzni-storage', '$mime_type', $file_size, 1);"
    
    npx wrangler d1 execute spravzni-db --remote --command="$sql" || {
        echo "⚠️  Failed to create D1 reference for $media_key (may already exist)"
    }
    
    echo "✅ Registered: $media_key"
}

# Hero images
upload_and_register "hero.png" "images/hero/hero.png" "hero.background" "image"
upload_and_register "girl.png" "images/hero/girl.png" "hero.girl" "image"
upload_and_register "mangirl.png" "images/hero/mangirl.png" "hero.mangirl" "image"
upload_and_register "sub.png" "images/hero/sub.png" "hero.sub" "image"
upload_and_register "card.png" "images/hero/card.png" "hero.card" "image"

# Gallery images
for i in {2..12}; do
    if [ -f "$IMAGES_DIR/$i.png" ]; then
        upload_and_register "$i.png" "images/gallery/$i.png" "gallery.image$i" "image"
    fi
done

# Service images
for i in {1..5}; do
    if [ -f "$IMAGES_DIR/s$i.png" ]; then
        upload_and_register "s$i.png" "images/services/s$i.png" "services.service$i" "image"
    fi
done

# Vacation options
for i in {1..9}; do
    if [ -f "$IMAGES_DIR/p$i.png" ]; then
        upload_and_register "p$i.png" "images/vacations/p$i.png" "vacations.option$i" "image"
    fi
done

# Instagram carousel
for i in {1..5}; do
    if [ -f "$IMAGES_DIR/inst$i.jpg" ]; then
        upload_and_register "inst$i.jpg" "images/instagram/inst$i.jpg" "instagram.post$i" "image"
    fi
done

# Icons
upload_and_register "logo.svg" "images/icons/logo.svg" "icons.logo" "image"
upload_and_register "play.svg" "images/icons/play.svg" "icons.play" "image"
upload_and_register "pause.svg" "images/icons/pause.svg" "icons.pause" "image"
upload_and_register "call.svg" "images/icons/call.svg" "icons.call" "image"
upload_and_register "Chat.svg" "images/icons/Chat.svg" "icons.chat" "image"
upload_and_register "chatf.svg" "images/icons/chatf.svg" "icons.chatf" "image"
upload_and_register "location.svg" "images/icons/location.svg" "icons.location" "image"
upload_and_register "locat.svg" "images/icons/locat.svg" "icons.locat" "image"
upload_and_register "list.svg" "images/icons/list.svg" "icons.list" "image"
upload_and_register "lapki.svg" "images/icons/lapki.svg" "icons.lapki" "image"

# Social icons
upload_and_register "inst.svg" "images/icons/inst.svg" "icons.inst" "image"
upload_and_register "instb.svg" "images/icons/instb.svg" "icons.instb" "image"
upload_and_register "instw.svg" "images/icons/instw.svg" "icons.instw" "image"
upload_and_register "fb.svg" "images/icons/fb.svg" "icons.fb" "image"
upload_and_register "fbw.svg" "images/icons/fbw.svg" "icons.fbw" "image"

# Feature icons
upload_and_register "sparks.svg" "images/icons/sparks.svg" "icons.sparks" "image"
upload_and_register "sparks_1.svg" "images/icons/sparks_1.svg" "icons.sparks1" "image"
upload_and_register "people-safe-one.svg" "images/icons/people-safe-one.svg" "icons.people-safe" "image"
upload_and_register "wheelchair.svg" "images/icons/wheelchair.svg" "icons.wheelchair" "image"
upload_and_register "Coordinator.svg" "images/icons/Coordinator.svg" "icons.coordinator" "image"
upload_and_register "fork-spoon.svg" "images/icons/fork-spoon.svg" "icons.fork-spoon" "image"
upload_and_register "bus-one.svg" "images/icons/bus-one.svg" "icons.bus" "image"
upload_and_register "Wi FI.svg" "images/icons/Wi FI.svg" "icons.wifi" "image"
upload_and_register "rotate.svg" "images/icons/rotate.svg" "icons.rotate" "image"
upload_and_register "sunrise.svg" "images/icons/sunrise.svg" "icons.sunrise" "image"
upload_and_register "house.svg" "images/icons/house.svg" "icons.house" "image"
upload_and_register "riding.svg" "images/icons/riding.svg" "icons.riding" "image"
upload_and_register "tub.svg" "images/icons/tub.svg" "icons.tub" "image"

# Partner logos
upload_and_register "fond.svg" "images/partners/fond.svg" "partners.fond" "image"
upload_and_register "Group.svg" "images/partners/Group.svg" "partners.group" "image"
upload_and_register "habilitationcenter.svg" "images/partners/habilitationcenter.svg" "partners.habilitationcenter" "image"
upload_and_register "lvivskamiskarada.svg" "images/partners/lvivskamiskarada.svg" "partners.lvivska" "image"
upload_and_register "manivci.svg" "images/partners/manivci.svg" "partners.manivci" "image"
upload_and_register "par.svg" "images/partners/par.svg" "partners.par" "image"
upload_and_register "parr.svg" "images/partners/parr.svg" "partners.parr" "image"
upload_and_register "parrr.svg" "images/partners/parrr.svg" "partners.parrr" "image"
upload_and_register "parrrrr.svg" "images/partners/parrrrr.svg" "partners.parrrrr" "image"
upload_and_register "parrrrrrr.svg" "images/partners/parrrrrrr.svg" "partners.parrrrrrr" "image"

# Additional images
if [ -f "$IMAGES_DIR/offerone.png" ]; then
    upload_and_register "offerone.png" "images/offers/offerone.png" "offers.one" "image"
fi

for i in {1..5}; do
    if [ -f "$IMAGES_DIR/e$i.png" ]; then
        upload_and_register "e$i.png" "images/gallery/e$i.png" "gallery.e$i" "image"
    fi
done

echo ""
echo "✨ Migration complete!"
echo "📊 Check D1 database for media references:"
echo "   npx wrangler d1 execute spravzni-db --remote --command=\"SELECT COUNT(*) FROM media;\""

