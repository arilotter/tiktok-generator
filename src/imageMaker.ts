import { GlobalFonts, type SKRSContext2D, createCanvas } from "@napi-rs/canvas";
import palettes from "nice-color-palettes";
GlobalFonts.registerFromPath(
	require("@canvas-fonts/comic-sans-ms"),
	"Comic Sans MS",
);

const width = 1080;
const height = 1920;
const padding = 64;
const topOffset = 300;
const fontSize = 58;

export function getPalette() {
	const p = palettes[~~(Math.random() * palettes.length)]
		.map(hex2rgb)
		.sort((a, b) => brightness(...a) - brightness(...b));

	const textColor = p[0];
	const bgColor = p[p.length - 2];
	const bgBorder = p[p.length - 1];

	return {
		textColor: `rgb(${textColor[0]}, ${textColor[1]}, ${textColor[2]})`,
		bgColor: `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.7)`,
		bgBorder: `rgba(${bgBorder[0]}, ${bgBorder[1]}, ${bgBorder[2]}, 0.7)`,
	};
}

export function getImage(
	text: string,
	textColor: string,
	bgColor: string,
	bgBorder: string,
) {
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");
	ctx.font = `${fontSize}px Comic Sans MS`;
	ctx.textAlign = "center";
	const writtenHeight = measureWrapText(
		ctx,
		text,
		width - padding * 3,
		fontSize * 1.5,
	);

	ctx.lineWidth = 10;
	ctx.fillStyle = bgColor;
	ctx.strokeStyle = bgBorder;
	ctx.fillRect(
		padding,
		topOffset,
		width - padding * 2,
		topOffset + writtenHeight,
	);
	ctx.strokeRect(
		padding,
		topOffset,
		width - padding * 2,
		topOffset + writtenHeight,
	);

	ctx.fillStyle = "#efefef";
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
	maxWidth: number,
	lineHeight: number,
): number {
	const words = text.split(" ");
	let line = "";
	let yOff = 0;

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
	return yOff;
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

function hex2rgb(hex: string): [number, number, number] {
	const nums = hex.replace("#", "").match(/.{1,2}/g);
	if (!nums) {
		throw new Error(`invalid hex color ${hex}`);
	}
	return nums.map((e) => Number.parseInt(e, 16)) as [number, number, number];
}

function brightness(r: number, g: number, b: number) {
	return 0.2 * r + 0.7 * g + 0.1 * b;
}
