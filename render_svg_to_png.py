# Let's check if we have rsvg-convert or imagemagick convert
import subprocess

try:
    res = subprocess.run(["convert", "public/assets/imgs/signature-vector.svg", "public/assets/imgs/signature-white.png"], capture_output=True, text=True)
    print("convert return code:", res.returncode, res.stderr)
except Exception as e:
    print("convert failed:", e)
