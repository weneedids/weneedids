
import React, { useState, useEffect } from "react";
import { Youtube } from "lucide-react";

export default function DJMixFinder() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "auto";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const activeDark = saved === "dark" || (saved === "auto" && prefersDark);
    setIsDark(activeDark);
    document.documentElement.classList.toggle("dark", activeDark);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const handleSearch = async () => {
    if (!query) return;

    const youtubeRes = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`);
    const soundcloudRes = await fetch(`/api/soundcloud?q=${encodeURIComponent(query)}`);

    const ytData = await youtubeRes.json();
    const scData = await soundcloudRes.json();

    setResults([...ytData.results, ...scData.results]);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-900 text-black dark:text-white px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="bg-zinc-200 dark:bg-zinc-700 text-sm px-3 py-1 rounded"
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-6">WE NEED IDs</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full">
          <input
            className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white p-2 rounded w-full"
            placeholder="Enter song name (e.g. Fisher Losing It extended mix)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded w-full sm:w-auto"
          >
            Search
          </button>
        </div>

        <div className="grid gap-6 w-full">
          {results.map((res, i) => (
            <div key={i} className="border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col sm:flex-row gap-4 bg-white dark:bg-zinc-800">
              <img src={res.thumbnail} alt="thumbnail" className="w-full sm:w-40 h-24 object-cover rounded-md" />
              <div className="flex flex-col justify-between">
                <div>
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:underline">
                    {res.title}
                  </a>
                  <p className="text-sm text-gray-600 dark:text-gray-400">By {res.uploader}</p>
                </div>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  {res.platform === "youtube" && <Youtube className="w-4 h-4" />}
                  {res.platform === "soundcloud" && <span title="SoundCloud">🎵</span>}
                  <span className="bg-gray-100 dark:bg-zinc-700 rounded px-2 py-0.5">Duration: {res.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
