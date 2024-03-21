# tiktok-generator

Rips a reddit "am i the asshole" story from the frontpage and a random youtube video of minecraft parkour,
overlays em with TTS, render out.

To install dependencies:

```bash
nix develop # or `direnv allow`
bun install
```

To run:

```bash
# First start the TTS server:
docker run -it -p 7860:7860 --platform=linux/amd64 registry.hf.space/styletts2-styletts2:latest python app.py`

# then, in another terminal, let 'er rip!
bun run src/index.ts
```


This project was created using `bun init` in bun v1.0.33. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
