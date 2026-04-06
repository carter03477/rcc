const { createCanvas } = require('canvas');
const fs = require('fs');

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Purple gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // White "RCC" text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.25}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RCC', size / 2, size / 2);
    
    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`icon-${size}.png`, buffer);
    console.log(`✅ Created icon-${size}.png`);
}

// Generate both sizes
createIcon(192);
createIcon(512);
console.log('🎉 All icons created!');
