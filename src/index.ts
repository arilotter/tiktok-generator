// bunch of weird hacks to make it work!
import "./gradio-hacks";

import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getImage } from "./imageMaker";
import { getParkourVideo } from "./parkour";
import {
	expandTextForSpeaking,
	getPostBodyText,
	getRedditPosts,
} from "./reddit";
import { getSpeech } from "./tts";

Bun.$.throws(true);

const PROJECTS_DIR = "../projects";
const FINISHED_DIR = "../finished";

const bgVideo = getParkourVideo();

const posts = await getRedditPosts("AmItheAsshole");
const randomPost = posts[~~(Math.random() * posts.length)];
console.log("picked post: ", randomPost.title);

const postBody = await getPostBodyText(randomPost.link);
postBody.unshift(randomPost.title);

const projectName = randomPost.title
	.replaceAll(" ", "_")
	.replace(/[\W_]/g, "")
	.slice(0, 30);
const projDir = join(__dirname, PROJECTS_DIR, projectName);
await mkdir(projDir, {
	recursive: true,
});

const combinedBits = [];

const variants = [1, 2, 3, 4] as const;

const speaker = `${Math.random() > 0.5 ? "m" : "f"}-us-${
	variants[~~(Math.random() * variants.length)]
}` as const;

for (let i = 0; i < postBody.length; i++) {
	const text = postBody[i];
	const audioFile = join(projDir, `${i}.wav`);
	const imageFile = join(projDir, `${i}.png`);
	const audio = getSpeech(expandTextForSpeaking(text), speaker).then((speech) =>
		Bun.write(audioFile, speech),
	);
	const image = getImage(text).then((image) => Bun.write(imageFile, image));
	await Promise.all([audio, image]);
	console.log(`merging audio and video #${i}/${postBody.length - 1}`);
	const combinedAudioAndVideo = join(projDir, `combined_${i}.mkv`);
	await Bun.$`ffmpeg -i ${imageFile} -i ${audioFile} -acodec libmp3lame -filter:a "atempo=1.5" -vcodec ffv1 -level 1 -coder 1 -context 1 -g 1 ${combinedAudioAndVideo}`;
	combinedBits.push(combinedAudioAndVideo);
	console.log(`DONE merging audio and video #${i}/${postBody.length - 1}`);
	console.log("---");
}

console.log("downloading bg video...");
const bgVideoPath = join(projDir, "bg.mp4");
const bgv = await bgVideo;
console.log("writing bg video...");
await Bun.write(bgVideoPath, bgv);
console.log("wrote bg video");

const comboTxt = join(projDir, "combo.txt");
const allClips = join(projDir, "allClips.mkv");
console.log("combining all clips");
await Bun.write(comboTxt, combinedBits.map((c) => `file ${c}`).join("\n"));
await Bun.$`ffmpeg -f concat -safe 0 -i ${comboTxt} -c copy ${allClips}`.quiet();

console.log("combined, getting length of combined");
const combinedLength = Math.round(
	Number.parseFloat(
		(
			await Bun.$`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${allClips}`.quiet()
		).stdout.toString(),
	) + 1,
);
console.log(`length is ${combinedLength}. adding minecraft video...`);

const croppedBGVideo = join(projDir, "bg_crop.mp4");
await Bun.$`ffmpeg -i ${bgVideoPath} -t ${combinedLength} -vf "scale='if(gt(iw,ih),1920,-1)':'if(gt(iw,ih),-1,1920)',crop=1080:1920" ${croppedBGVideo}`;
console.log("wrote cropped bg video");

const finishedDir = join(__dirname, FINISHED_DIR);

await mkdir(finishedDir, {
	recursive: true,
});

const finishedFile = join(finishedDir, `${projectName}.mp4`);

await Bun.$`ffmpeg -i ${croppedBGVideo} -i ${allClips} -filter_complex "[0:v][1:v]overlay;[0:a][1:a]amix" ${finishedFile}`;


console.log("Done with project! Output file at", finishedFile)