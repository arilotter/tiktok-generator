import { client } from "@gradio/client";

export type Voice = `${"m" | "f"}-us-${1 | 2 | 3 | 4}`;

const API_URL = "http://localhost:7860";
const app = await client(API_URL, {});
export async function getSpeech(
	text: string,
	voice: Voice = "m-us-2",
	steps = 3,
): Promise<ArrayBuffer> {
	console.log(
		`synthesizing text "${text}" with voice ${voice} and steps ${steps}...`,
	);
	const result = await app.predict("/synthesize", [text, voice, steps]);
	if (
		!result ||
		typeof result !== "object" ||
		!("data" in result) ||
		!Array.isArray(result.data) ||
		!result.data[0] ||
		!("path" in result.data[0]) ||
		typeof result.data[0].path !== "string"
	) {
		throw new Error(`Failed to synth text ${text}:\n${JSON.stringify(result)}`);
	}
	console.log("downloading audio...");
	const audioPath = result.data[0].path;
	const audioReq = await fetch(`${API_URL}/file=${audioPath}`);
	const audio = await audioReq.arrayBuffer();
	console.log("done!");
	return audio;
}
