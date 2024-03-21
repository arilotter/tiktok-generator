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
	const writtenHeight = measureWrapText(
		ctx,
		text,
		width / 2,
		topOffset + padding * 1.5,
		width - padding * 3,
		fontSize * 1.5,
	);

	ctx.lineWidth = 10;
	ctx.fillStyle = "rgba(231, 240, 255, 0.7)";
	ctx.strokeStyle = "rgba(220, 73, 58, 0.7)";
	ctx.fillRect(
		padding,
		topOffset,
		width - padding * 2,
		topOffset + writtenHeight + padding,
	);
	ctx.strokeRect(
		padding,
		topOffset,
		width - padding * 2,
		topOffset + writtenHeight + padding,
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

function measureWrapText(
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
			line = `${words[n]} `;
			yOff += lineHeight;
		} else {
			line = testLine;
		}
	}
	return yOff - y;
}

function wrapText(
	ctx: SKRSContext2D,
	text: string,
	x: number,
	y: number,
	maxWidth: number,
	lineHeight: number,
) {
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
}
