const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const baseDir = path.join(__dirname, 'assets');
for (const folder of ['resume', 'company', 'education', 'projects']) {
  fs.mkdirSync(path.join(baseDir, folder), { recursive: true });
}

function pngChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(data) >>> 0, 0);
  return Buffer.concat([length, Buffer.from(type), data, crc]);
}

function createSolidPng(outputPath, width, height, rgb) {
  const rows = Buffer.alloc(0);
  const pixels = [];
  for (let y = 0; y < height; y++) {
    pixels.push(0);
    for (let x = 0; x < width; x++) {
      pixels.push(rgb[0], rgb[1], rgb[2], 255);
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const compressed = zlib.deflateSync(Buffer.from(pixels));
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0))
  ]);

  fs.writeFileSync(outputPath, png);
}

createSolidPng(path.join(baseDir, 'company', 'innoknowvex-logo.png'), 640, 180, [255, 138, 106]);
createSolidPng(path.join(baseDir, 'education', 'lpu-logo.png'), 640, 180, [255, 156, 126]);
createSolidPng(path.join(baseDir, 'education', 'sri-jyothi-logo.png'), 640, 180, [125, 200, 255]);
createSolidPng(path.join(baseDir, 'education', 'sri-chaitanya-logo.png'), 640, 180, [120, 230, 176]);
createSolidPng(path.join(baseDir, 'projects', 'attendance.png'), 1200, 760, [18, 22, 31]);
createSolidPng(path.join(baseDir, 'projects', 'restaurant.png'), 1200, 760, [26, 32, 42]);

const pdf = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 48 >>\nstream\nBT\n/F1 18 Tf\n50 70 Td\n(Venkata Narendra Resume) Tj\nET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000063 00000 n \n0000000127 00000 n \n0000000288 00000 n \n0000000644 00000 n \ntrailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n742\n%%EOF\n");
fs.writeFileSync(path.join(baseDir, 'resume', 'Venkata-Narendra-Resume.pdf'), pdf);

console.log('Assets generated successfully.');
