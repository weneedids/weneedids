
export default async function handler(req, res) {
  const query = req.query.q;
  const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
  const url = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query + " extended OR remix OR club mix")}&client_id=${clientId}&limit=10`;

  const response = await fetch(url);
  const data = await response.json();

  const results = data.collection.map((track) => ({
    platform: "soundcloud",
    title: track.title,
    url: track.permalink_url,
    thumbnail: track.artwork_url?.replace("-large", "-t500x500") || "",
    uploader: track.user.username,
    duration: `${Math.floor(track.duration / 60000)}:${("0" + Math.floor((track.duration % 60000) / 1000)).slice(-2)}`,
  }));

  res.status(200).json({ results });
}
