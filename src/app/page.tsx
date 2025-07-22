
import { get } from "@vercel/edge-config";
import PageClient from "./page-client";

export default async function HomePage() {
  let youtubeVideoUrl: string | undefined;
  const defaultYoutubeUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

  try {
    youtubeVideoUrl = await get<string>('youtubeVideoUrl');
  } catch (error) {
    console.log("Could not fetch from Edge Config, using default. Error: ", (error as Error).message);
  }

  return <PageClient youtubeVideoUrl={youtubeVideoUrl || defaultYoutubeUrl} />;
}
