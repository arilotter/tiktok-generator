import { GlobalFonts, type SKRSContext2D, createCanvas } from "@napi-rs/canvas";

GlobalFonts.registerFromPath(
	require("@canvas-fonts/comic-sans-ms"),
	"Comic Sans MS",
);

const width = 1080;
const height = 1920;
const padding = 64;
const topOffset = 300;
const fontSize = 48;
export function getImage(text: string) {
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");
	ctx.font = `${fontSize}px Comic Sans MS`;
	ctx.textAlign = "center";
	const writtenHeight = wrapText(
		ctx,
		text,
		width / 2,
		padding * 1.5,
		width - padding * 3,
		fontSize * 1.5,
	);

	ctx.lineWidth = 10;
	ctx.fillStyle = "#E7F0FF";
	ctx.strokeStyle = "#DC493A";
	ctx.fillRect(
		padding,
		topOffset + padding,
		width - padding * 2,
		topOffset + writtenHeight + padding * 2,
	);
	ctx.strokeRect(
		padding,
		topOffset + padding,
		width - padding * 2,
		topOffset + writtenHeight + padding * 2,
	);

	ctx.fillStyle = "#1b1b1b";
	wrapText(
		ctx,
		text,
		width / 2,
		topOffset + padding * 2,
		width - padding * 3,
		fontSize * 1.5,
	);
	return canvas.encode("png");
}

function wrapText(
	ctx: SKRSContext2D,
	text: string,
	x: number,
	y: number,
	maxWidth: number,
	lineHeight: number,
): number {
	const words = text.split(" ");
	let line = "";
	let yOff = y;

	for (let n = 0; n < words.length; n++) {
		const testLine = `${line + words[n]} `;
		const metrics = ctx.measureText(testLine);
		const testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			ctx.fillText(line, x, yOff);
			line = `${words[n]} `;
			yOff += lineHeight;
		} else {
			line = testLine;
		}
	}
	ctx.fillText(line, x, yOff);
	return yOff - y;
}
