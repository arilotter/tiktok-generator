declare module "youtube-search-api" {
	interface Item {
		type: "video";
		id: string;
	}
	interface ListResult {
		items: Array<Item>;
		nextPage?: { nextPageToken: string; nextPageContext: object };
	}
	interface ListOptions {
		type: "video" | "channel" | "playlist" | "movie";
	}
	export function GetListByKeyword(
		keywords: string,
		playlist: boolean,
		limit: number,
		options: Array<ListOptions>,
	): Promise<ListResult>;
}
