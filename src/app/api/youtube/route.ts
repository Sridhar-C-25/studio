import { NextResponse } from "next/server";

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: unknown;
}
interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
}
interface YouTubeStatsItem {
  id: string;
  statistics: { likeCount?: string };
}
interface YouTubeStatsResponse {
  items: YouTubeStatsItem[];
}

export async function GET() {
  try {
    // Fetch video list
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${process.env.YOUTUBE_CHANNEL_ID}&part=snippet,id&order=viewCount&maxResults=20&type=video&videoDuration=medium`
    );
    const data: YouTubeSearchResponse = await response.json();
    const videoIds = (data.items || [])
      .filter((item) => item.id && item.id.videoId)
      .map((item) => item.id.videoId)
      .join(",");

    // Fetch statistics for all videos
    let statsMap: Record<string, { likeCount?: string }> = {};
    if (videoIds) {
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${process.env.YOUTUBE_API_KEY}&id=${videoIds}&part=statistics`
      );
      const statsData: YouTubeStatsResponse = await statsRes.json();
      statsMap = (statsData.items || []).reduce((acc, item) => {
        acc[item.id] = item.statistics;
        return acc;
      }, {} as Record<string, { likeCount?: string }>);
    }

    // Attach likeCount to each video
    const itemsWithLikes = (data.items || []).map((item) => ({
      ...item,
      statistics: statsMap[item.id.videoId] || {},
    }));

    return NextResponse.json({ ...data, items: itemsWithLikes });
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return new Response("Error fetching YouTube data", { status: 500 });
  }
}
