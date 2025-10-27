export const SUPPORTED_HOSTS = new Set<string>([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtu.be',
  'tiktok.com',
  'www.tiktok.com',
  'vm.tiktok.com',
  'instagram.com',
  'www.instagram.com',
]);

export const MAX_URL_LENGTH = 2048;
export const MAX_HOST_LENGTH = 255;

// Platforms supported for publishing in the MVP
export enum PublishPlatform {
  YouTubeShorts = 'youtube_shorts',
  TikTok = 'tiktok',
  InstagramReels = 'instagram_reels',
}

export const PUBLISH_PLATFORMS: string[] = [
  PublishPlatform.YouTubeShorts,
  PublishPlatform.TikTok,
  PublishPlatform.InstagramReels,
];
