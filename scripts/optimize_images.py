"""把 art/ 里的原图压成 WebP 输出到 content/images/（App 实际加载的目录）。

用法：python -I scripts/optimize_images.py [--force]
- 原图（Magpie 生成的 1–2.5 MB PNG）留在 art/，便于以后重新压缩或修图
- 输出按显示尺寸缩小：单词图 512px，地图背景 720px 宽，其余界面图 384px
- 透明图保留 alpha；只处理比输出新的原图，--force 全部重做
"""

import argparse
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "art"
DST = ROOT / "content" / "images"

# 相对 art/ 的路径前缀 → 最长边
SIZES = [
    ("ui/map-bg.png", 720),
    ("ui/", 384),
    ("mascot.png", 384),
]
DEFAULT = 512
QUALITY = 80


def target_size(rel):
    for prefix, size in SIZES:
        if rel.startswith(prefix):
            return size
    return DEFAULT


def convert(src, dst, size):
    im = Image.open(src)
    has_alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
    im = im.convert("RGBA" if has_alpha else "RGB")
    im.thumbnail((size, size), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, "WEBP", quality=QUALITY, method=6)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    before = after = made = 0
    for src in sorted(SRC.rglob("*.png")):
        rel = src.relative_to(SRC).as_posix()
        dst = DST / Path(rel).with_suffix(".webp")
        if not args.force and dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
            continue
        convert(src, dst, target_size(rel))
        before += src.stat().st_size
        after += dst.stat().st_size
        made += 1
        print(f"{rel:45s} {src.stat().st_size // 1024:6d} KB -> {dst.stat().st_size // 1024:4d} KB")
    if made:
        print(f"done: {made} images, {before / 1048576:.1f} MB -> {after / 1048576:.2f} MB")
    else:
        print("nothing to do")


if __name__ == "__main__":
    sys.exit(main())
