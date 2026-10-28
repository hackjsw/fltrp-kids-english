"""按 book.json 用 edge-tts 生成发音 MP3。

用法：python -I scripts/gen_audio.py [--voice en-GB-SoniaNeural] [--force]
输出：content/audio/{book}/{item_id}.mp3、content/audio/common/*.mp3
生成时需要联网（调用微软在线语音），生成后 App 只读本地文件。
"""

import argparse
import asyncio
import json
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"

# 跟读反馈、听音选图提示语
COMMON = {
    "great": "Great job!",
    "good": "Good!",
    "try-again": "Try again.",
}


async def synth(text, path, voice, rate):
    path.parent.mkdir(parents=True, exist_ok=True)
    await edge_tts.Communicate(text, voice, rate=rate).save(str(path))


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--book", default="1a")
    ap.add_argument("--voice", default="en-US-AnaNeural")
    ap.add_argument("--rate", default="-15%", help="语速，孩子用稍慢一点")
    ap.add_argument("--force", action="store_true", help="覆盖已有文件")
    args = ap.parse_args()

    book = json.loads((CONTENT / "books" / args.book / "book.json").read_text(encoding="utf-8"))
    jobs = []
    for mod in book["modules"]:
        for unit in mod["units"]:
            for item in unit["items"]:
                jobs.append((item["text"], CONTENT / "audio" / args.book / f"{item['id']}.mp3"))
    for key, text in COMMON.items():
        jobs.append((text, CONTENT / "audio" / "common" / f"{key}.mp3"))

    made = 0
    for text, path in jobs:
        if path.exists() and not args.force:
            continue
        await synth(text, path, args.voice, args.rate)
        made += 1
        print(f"ok  {path.relative_to(ROOT)}  {text}")
    print(f"done: {made} generated, {len(jobs) - made} skipped, voice={args.voice}")


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
