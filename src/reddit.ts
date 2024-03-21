const frontpageRegex =
	/<a class=".*?title.*?" data-event-action="title" href="(.*?)".*?>(.*?)<\/a>/gm;

const bodyTextRegex =
	/<div class="expando expando-uninitialized".*?<div class="usertext-body.*" ><div class="md">((.|\n)*?)<\/div>/;

export async function getRedditPosts(subreddit: string) {
	const redditPosts = await fetch(
		`https://old.reddit.com/r/${subreddit}/`,
	).then((r) => r.text());

	let m = frontpageRegex.exec(redditPosts); // skip first one, it's a pinned post

	const posts = [];

	do {
		m = frontpageRegex.exec(redditPosts);
		if (!m) {
			break;
		}
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === frontpageRegex.lastIndex) {
			frontpageRegex.lastIndex++;
		}

		const [_, link, title] = m;
		const cleanTitle = unescapeHtml(title);
		posts.push({ title: cleanTitle, link });
	} while (m != null);

	return posts;
}

export async function getPostBodyText(postURL: string): Promise<Array<string>> {
	const post = await fetch(`https://old.reddit.com/${postURL}`).then((r) =>
		r.text(),
	);

	const res = post.match(bodyTextRegex);
	if (!res || res.length < 2) {
		throw new Error("Failed to fetch post body.");
	}
	return unescapeHtml(res[1])
		.replaceAll("<p>", "")
		.replaceAll("</p>", "\n")
		.replace(/<.*?>.*?<\/.*?>/g, "")
		.split(".")
		.map((b) => b.trim())
		.filter((b) => b.length);
}

export function expandTextForSpeaking(text: string): string {
	return `${text
		.replace(/AITAH?/ig, "Am I the asshole")
		.replace(/WIBTAH?/ig, "Would I be the asshole")}.`;
}

function unescapeHtml(safe: string) {
	return safe
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#x200B;/g, ' ')
		.replace(/&#(\d+);/gi, (_, numStr) => {
			const num = Number.parseInt(numStr, 10);
			return String.fromCharCode(num);
		});
}
