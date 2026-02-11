/** Supported video codecs. */
export type VideoCodec =
  | 'h264'     // H.264/AVC (default, most compatible)
  | 'h265'     // H.265/HEVC (better compression)
  | 'vp8'      // VP8 (WebM)
  | 'vp9'      // VP9 (WebM, better compression)
  | 'prores';  // ProRes (professional editing)

/** ProRes profile. */
export type ProResProfile = 'proxy' | 'lt' | 'standard' | 'hq' | '4444' | '4444-xq';

/** Audio codecs. */
export type AudioCodec = 'aac' | 'mp3' | 'wav' | 'opus' | 'flac';

/** Encoding configuration. */
export interface EncodingConfig {
  /** Video codec (default 'h264') */
  videoCodec?: VideoCodec;
  /** Audio codec (default 'aac') */
  audioCodec?: AudioCodec;
  /** Constant Rate Factor for quality (lower = better, codec-dependent) */
  crf?: number;
  /** Video bitrate (e.g., '5M', '10M') */
  videoBitrate?: string;
  /** Audio bitrate (e.g., '128k', '320k') */
  audioBitrate?: string;
  /** ProRes profile (only when videoCodec is 'prores') */
  proresProfile?: ProResProfile;
  /** Pixel format (default 'yuv420p') */
  pixelFormat?: string;
}
