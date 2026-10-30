"""把 Magpie 生成的图标拼图切成单个图标，再打包成一张精灵图。

用法：python -I scripts/icon_sheets.py
- 拼图和提示词登记在 art/ui/sheets.json；拼图原图在 art/ui/sheets/（不上传）
- 按透明通道找出每个图标，按它的中心落在哪一格来对应名字，所以图标画得不太齐也能切对
- 切出的单个图标存到 art/ui/icons/ 方便检查；打包结果写进 web/src/assets/，
  由 Vite 加上内容 hash，整站只多一次图片请求，并且能长期缓存
"""

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / "art" / "ui"
OUT_DIR = ART / "icons"
ATLAS = ROOT / "web" / "src" / "assets" / "icons.webp"
INDEX = ROOT / "web" / "src" / "assets" / "icons.json"

SOLID = 24  # 算作图标主体的最低不透明度
FAINT = 8  # 低于这个的半透明杂点直接去掉
PAD = 0.06  # 图标在格子里四周留白的比例


def slice_sheet(sheet):
    src = ART / sheet["path"]
    rgba = np.array(Image.open(src).convert("RGBA"))
    alpha = rgba[..., 3]
    h, w = alpha.shape
    rows, cols, names = sheet["rows"], sheet["cols"], sheet["names"]
    if len(names) != rows * cols:
        sys.exit(f"{sheet['path']}: {len(names)} 个名字，但格子是 {rows}x{cols}")

    solid = alpha > SOLID
    # 稍微膨胀后再连通，图标旁边分开的小部件（声波、气泡）跟着主体走
    grown, n = ndimage.label(ndimage.binary_dilation(solid, iterations=6))
    sizes = ndimage.sum(solid, grown, range(1, n + 1))
    cells = {}
    for k, box in enumerate(ndimage.find_objects(grown), 1):
        if sizes[k - 1] < w * h * 0.0005:
            continue  # 噪点
        cy = (box[0].start + box[0].stop) / 2
        cx = (box[1].start + box[1].stop) / 2
        cell = min(int(cy / h * rows), rows - 1) * cols + min(int(cx / w * cols), cols - 1)
        cells.setdefault(cell, []).append(k)

    icons = {}
    for cell, name in enumerate(names):
        parts = cells.get(cell)
        if not parts:
            print(f"  ! {name}: 格子 {cell} 是空的，需要重画")
            continue
        member = np.isin(grown, parts)
        keep = member & (alpha > FAINT)
        ys, xs = np.nonzero(keep)
        crop = rgba[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1].copy()
        crop[..., 3] = np.where(keep[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1], crop[..., 3], 0)
        icons[name] = Image.fromarray(crop, "RGBA")
        if len(parts) > 1:
            print(f"  · {name}: 合并了 {len(parts)} 块")
    return icons


def fit(icon, cell):
    inner = round(cell * (1 - 2 * PAD))
    icon = icon.copy()
    icon.thumbnail((inner, inner), Image.LANCZOS)
    out = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
    out.alpha_composite(icon, ((cell - icon.width) // 2, (cell - icon.height) // 2))
    return out


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    conf = json.loads((ART / "sheets.json").read_text(encoding="utf-8"))
    cell = conf["cell"]
    icons, order = {}, []
    for sheet in conf["sheets"]:
        print(sheet["path"])
        for name, icon in slice_sheet(sheet).items():
            icons[name] = icon  # 后面的拼图覆盖前面同名的
        order += [n for n in sheet["names"] if n not in order]

    missing = [n for n in order if n not in icons]
    if missing:
        sys.exit(f"缺少图标：{', '.join(missing)}，没有更新精灵图")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    cols = 5
    rows = -(-len(order) // cols)
    atlas = Image.new("RGBA", (cols * cell, rows * cell), (0, 0, 0, 0))
    for i, name in enumerate(order):
        icons[name].save(OUT_DIR / f"{name}.png")
        atlas.alpha_composite(fit(icons[name], cell), ((i % cols) * cell, (i // cols) * cell))

    ATLAS.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(ATLAS, "WEBP", quality=80, method=6)
    INDEX.write_text(json.dumps({"cols": cols, "rows": rows, "names": order}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(order)} 个图标 -> {ATLAS.relative_to(ROOT).as_posix()} {atlas.width}x{atlas.height}, {ATLAS.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
