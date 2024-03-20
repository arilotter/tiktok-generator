import { GetListByKeyword } from "youtube-search-api";
export async function getParkourVideo() {
	console.log("finding a parkour vid..");
	const { items } = await GetListByKeyword(
		"minecraft parkour tiktok format",
		false,
		20,
		[{ type: "video" }],
	);

	const randomVideo = items[~~(Math.random() * items.length)].id;

	const url = `https://www.youtube.com/watch?v=${randomVideo}`;
	console.log("downloading parkour vid", url);

	return (await Bun.$`yt-dlp ${url} -o -`.quiet()).stdout;
}
