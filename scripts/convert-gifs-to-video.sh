#!/bin/bash

# Script to convert GIF files to optimized MP4 and WebM videos
# This reduces file sizes by ~90% while maintaining quality

set -e  # Exit on error

VISUALS_DIR="public/visuals"
BACKUP_DIR="public/visuals/originals"

echo "🎬 GIF to Video Conversion Script"
echo "=================================="
echo ""

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
  echo "📁 Creating backup directory: $BACKUP_DIR"
  mkdir -p "$BACKUP_DIR"
fi

# Count total GIFs
total_gifs=$(ls -1 "$VISUALS_DIR"/*.gif 2>/dev/null | wc -l | tr -d ' ')
if [ "$total_gifs" -eq 0 ]; then
  echo "❌ No GIF files found in $VISUALS_DIR"
  exit 1
fi

echo "📊 Found $total_gifs GIF files to convert"
echo ""

current=0
total_size_before=0
total_size_after=0

# Process each GIF file
for gif_file in "$VISUALS_DIR"/*.gif; do
  current=$((current + 1))
  filename=$(basename "$gif_file" .gif)

  echo "[$current/$total_gifs] Processing: $filename.gif"

  # Get original size
  size_before=$(du -k "$gif_file" | cut -f1)
  total_size_before=$((total_size_before + size_before))

  # Convert to MP4 (H.264)
  # scale=800:-2 ensures height is divisible by 2 (required for H.264)
  echo "  🔄 Converting to MP4..."
  ffmpeg -i "$gif_file" \
    -vf "scale=800:-2" \
    -c:v libx264 \
    -preset slow \
    -crf 28 \
    -movflags +faststart \
    -pix_fmt yuv420p \
    -an \
    "$VISUALS_DIR/$filename.mp4" \
    -y -loglevel error

  # Convert to WebM (VP9)
  echo "  🔄 Converting to WebM..."
  ffmpeg -i "$gif_file" \
    -vf "scale=800:-2" \
    -c:v libvpx-vp9 \
    -crf 35 \
    -b:v 0 \
    -an \
    "$VISUALS_DIR/$filename.webm" \
    -y -loglevel error

  # Calculate sizes after conversion
  mp4_size=$(du -k "$VISUALS_DIR/$filename.mp4" | cut -f1)
  webm_size=$(du -k "$VISUALS_DIR/$filename.webm" | cut -f1)
  total_size_after=$((total_size_after + mp4_size + webm_size))

  # Show size comparison (use awk for formatting since numfmt might not be available on macOS)
  echo "  📊 Original: $(awk "BEGIN {printf \"%.1f MB\", $size_before / 1024}")"
  echo "  📊 MP4:      $(awk "BEGIN {printf \"%.1f MB\", $mp4_size / 1024}")"
  echo "  📊 WebM:     $(awk "BEGIN {printf \"%.1f MB\", $webm_size / 1024}")"

  # Calculate reduction
  reduction=$(awk "BEGIN {printf \"%.1f\", (1 - ($mp4_size + $webm_size) / $size_before) * 100}")
  echo "  ✅ Reduced by: ${reduction}%"
  echo ""
done

# Move original GIFs to backup
echo "📦 Moving original GIFs to $BACKUP_DIR"
mv "$VISUALS_DIR"/*.gif "$BACKUP_DIR/" 2>/dev/null || true

# Calculate total savings
total_before_mb=$(awk "BEGIN {printf \"%.1f\", $total_size_before / 1024}")
total_after_mb=$(awk "BEGIN {printf \"%.1f\", $total_size_after / 1024}")
total_reduction=$(awk "BEGIN {printf \"%.1f\", (1 - $total_size_after / $total_size_before) * 100}")

echo "=================================="
echo "✅ Conversion Complete!"
echo ""
echo "📊 Total Size Before: ${total_before_mb} MB"
echo "📊 Total Size After:  ${total_after_mb} MB"
echo "🎉 Total Reduction:   ${total_reduction}%"
echo ""
echo "Original GIFs backed up to: $BACKUP_DIR"
