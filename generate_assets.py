import os
import struct
import zlib

base = os.path.join(os.getcwd(), 'assets')
for folder in ['resume', 'company', 'education', 'projects']:
    os.makedirs(os.path.join(base, folder), exist_ok=True)


def png_chunk(chunk_type, data):
    return (
        struct.pack('!I', len(data))
        + chunk_type
        + data
        + struct.pack('!I', zlib.crc32(chunk_type + data) & 0xffffffff)
    )


def create_solid_png(path, width, height, color_rgb):
    rows = bytearray()
    for _ in range(height):
        rows.append(0)
        for _ in range(width):
            rows.extend((color_rgb[0], color_rgb[1], color_rgb[2], 255))
    ihdr = struct.pack('!IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png = b'\x89PNG\r\n\x1a\n'
    png += png_chunk(b'IHDR', ihdr)
    png += png_chunk(b'IDAT', zlib.compress(bytes(rows), 9))
    png += png_chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(png)

create_solid_png(os.path.join(base, 'company', 'innoknowvex-logo.png'), 640, 180, (255, 138, 106))
create_solid_png(os.path.join(base, 'education', 'lpu-logo.png'), 640, 180, (255, 156, 126))
create_solid_png(os.path.join(base, 'education', 'sri-jyothi-logo.png'), 640, 180, (125, 200, 255))
create_solid_png(os.path.join(base, 'education', 'sri-chaitanya-logo.png'), 640, 180, (120, 230, 176))
create_solid_png(os.path.join(base, 'projects', 'attendance.png'), 1200, 760, (18, 22, 31))
create_solid_png(os.path.join(base, 'projects', 'restaurant.png'), 1200, 760, (26, 32, 42))

pdf = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 48 >>\nstream\nBT\n/F1 18 Tf\n50 70 Td\n(Venkata Narendra Resume) Tj\nET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000063 00000 n \n0000000127 00000 n \n0000000288 00000 n \n0000000644 00000 n \ntrailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n742\n%%EOF\n"
with open(os.path.join(base, 'resume', 'Venkata-Narendra-Resume.pdf'), 'wb') as f:
    f.write(pdf)

print('Assets generated.')
