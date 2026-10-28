"""把一批原图拼成带编号的预览图，方便人工检查。
用法：python -I scripts/contact_sheet.py art/1a/m3 art/1a/m4 -o textbooks/sheet.jpg
"""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument("dirs", nargs="+")
ap.add_argument("-o", "--out", required=True)
ap.add_argument("--cell", type=int, default=180)
ap.add_argument("--cols", type=int, default=8)
args = ap.parse_args()

files = [f for d in args.dirs for f in sorted(Path(d).glob("*.png"))]
W, cols = args.cell, args.cols
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (W + 16)), (255, 244, 236))
draw = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGBA")
    im.thumbnail((W, W))
    bg = Image.new("RGBA", (W, W), (255, 255, 255, 255))
    bg.alpha_composite(im, ((W - im.width) // 2, (W - im.height) // 2))
    x, y = (i % cols) * W, (i // cols) * (W + 16)
    sheet.paste(bg.convert("RGB"), (x, y))
    draw.text((x + 3, y + W + 2), f"{f.parent.name}/{f.stem}"[:28], fill=(80, 50, 30))
sheet.save(args.out, quality=82)
print(len(files), "images ->", args.out)
