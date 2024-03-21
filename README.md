# tiktok-generator

To install dependencies:

```bash
nix develop # or `direnv allow`
bun install
```

To run:
First start the TTS server:
`docker run -it -p 7860:7860 --platform=linux/amd64 registry.hf.space/styletts2-styletts2:latest python app.py`

```bash
bun run src/index.ts
```


Rip a reddit "am i the asshole" story and a random youtube video of minecraft parkour,
overlay em with TTS, render out.

This project was created using `bun init` in bun v1.0.33. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
