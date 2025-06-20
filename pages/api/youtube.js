
export default async function handler(req, res) {
  const query = req.query.q;
  const apiKey = process.env.YOUTUBE_API_KEY;
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(query + " extended OR remix OR club mix")}&key=${apiKey}`;

  const response = await fetch(searchUrl);
  const data = await response.json();

  const results = await Promise.all(data.items.map(async (item) => {
    const videoId = item.id.videoId;
    const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`);
    const details = await detailsRes.json();
    const duration = details.items[0]?.contentDetails?.duration || "";

    return {
      platform: "youtube",
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: item.snippet.thumbnails.medium.url,
      uploader: item.snippet.channelTitle,
      duration,
    };
  }));

  res.status(200).json({ results });
}
