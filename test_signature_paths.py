# Let's inspect signature-vector.svg and signature.svg
with open("public/assets/imgs/signature.svg", "r") as f:
    content = f.read()

print("File signature.svg size:", len(content))
