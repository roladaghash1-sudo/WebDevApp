// services/youtubeService.js

async function searchYouTube(query, maxResults = 10) {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        throw new Error("Missing YOUTUBE_API_KEY");
    }

    const q = encodeURIComponent(query);

    const url =
        `https://www.googleapis.com/youtube/v3/search` +
        `?part=snippet&type=video&maxResults=${maxResults}&q=${q}&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error?.message || "YouTube API error");
    }

    return (data.items || []).map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url || ""
    }));
}

module.exports = { searchYouTube };
