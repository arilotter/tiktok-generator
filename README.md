# tiktok-generator

Rips a reddit "am i the asshole" story from the frontpage and a random youtube video of minecraft parkour,
overlays em with TTS, render out.
Sample output: https://www.youtube.com/watch?v=OILpowaNxJM

To install dependencies:

```bash
nix develop # or `direnv allow`
bun install
```

To run:

```bash
# First start the TTS server:
docker run -it -p 7860:7860 --platform=linux/amd64 --gpus all registry.hf.space/styletts2-styletts2:latest python app.py`

# then, in another terminal, let 'er rip!
bun start
```

If you want to avoid re-downloading the models every time you launch the styletts docker image,
you can do this while it's running:
```bash
docker ps # get the ID of the running container
docker commit <id> styletts2
```

and then future launches can be done with `docker run -it -p 7860:7860 --platform=linux/amd64 --gpus all styletts2 python app.py`, which should only take a few seconds.

This project was created using `bun init` in bun v1.0.33. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
