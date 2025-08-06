import Image from "next/image";

interface Video {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { medium: { url: string } };
    publishedAt: string;
  };
  statistics?: { likeCount?: string };
}

async function fetchVideos(): Promise<Video[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/youtube`,
      {
        // If deployed, use absolute URL; otherwise, fallback to relative
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch videos");
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export default async function VideoGrid() {
  const videos = await fetchVideos();
  return (
    <>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videos.map((video) => (
          <a
            key={video.id.videoId}
            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            title={video.snippet.title}
            className="block bg-muted/50 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-200"
          >
            <Image
              width={300}
              height={300}
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-full aspect-video object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                {video.snippet.title}
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground mb-1">
                  {new Date(video.snippet.publishedAt).toLocaleDateString()}
                </p>
                {video.statistics?.likeCount && (
                  <p className="text-xs text-green-600 font-semibold">
                    👍 {Number(video.statistics.likeCount).toLocaleString()}{" "}
                    Likes
                  </p>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
      {videos.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          No videos found.
        </div>
      )}
    </>
  );
}
