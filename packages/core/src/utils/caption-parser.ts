/**
 * SRT/VTT caption parser and utilities.
 */

import type { CaptionCue, CaptionFormat } from '../types/layer';

/**
 * Parse SRT format subtitles.
 *
 * SRT format:
 * 1
 * 00:00:01,000 --> 00:00:04,000
 * Hello World
 */
export function parseSRT(text: string): CaptionCue[] {
  const cues: CaptionCue[] = [];
  const blocks = text.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 3) continue;

    // Line 1: index (skip)
    // Line 2: timestamps
    const timeLine = lines[1];
    const match = timeLine.match(
      /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/,
    );
    if (!match) continue;

    const startTime =
      parseInt(match[1]) * 3600 +
      parseInt(match[2]) * 60 +
      parseInt(match[3]) +
      parseInt(match[4]) / 1000;

    const endTime =
      parseInt(match[5]) * 3600 +
      parseInt(match[6]) * 60 +
      parseInt(match[7]) +
      parseInt(match[8]) / 1000;

    // Lines 3+: text content
    const textContent = lines.slice(2).join('\n').trim();
    if (textContent) {
      cues.push({ startTime, endTime, text: textContent });
    }
  }

  return cues;
}

/**
 * Parse WebVTT format subtitles.
 *
 * VTT format:
 * WEBVTT
 *
 * 00:00:01.000 --> 00:00:04.000
 * Hello World
 */
export function parseVTT(text: string): CaptionCue[] {
  const cues: CaptionCue[] = [];
  // Remove WEBVTT header and any metadata
  const content = text.replace(/^WEBVTT[^\n]*\n/, '').trim();
  const blocks = content.split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 2) continue;

    // Find the timestamp line (may or may not have a cue ID before it)
    let timeLineIdx = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('-->')) {
        timeLineIdx = i;
        break;
      }
    }

    const timeLine = lines[timeLineIdx];
    const match = timeLine.match(
      /(?:(\d{2}):)?(\d{2}):(\d{2})[.](\d{3})\s*-->\s*(?:(\d{2}):)?(\d{2}):(\d{2})[.](\d{3})/,
    );
    if (!match) continue;

    const startTime =
      (parseInt(match[1] || '0') * 3600) +
      parseInt(match[2]) * 60 +
      parseInt(match[3]) +
      parseInt(match[4]) / 1000;

    const endTime =
      (parseInt(match[5] || '0') * 3600) +
      parseInt(match[6]) * 60 +
      parseInt(match[7]) +
      parseInt(match[8]) / 1000;

    const textContent = lines.slice(timeLineIdx + 1).join('\n').trim();
    if (textContent) {
      cues.push({ startTime, endTime, text: textContent });
    }
  }

  return cues;
}

/**
 * Auto-detect format and parse captions.
 */
export function parseCaptions(content: string, format?: CaptionFormat): CaptionCue[] {
  const detectedFormat = format || detectFormat(content);

  switch (detectedFormat) {
    case 'vtt':
      return parseVTT(content);
    case 'srt':
      return parseSRT(content);
    case 'plain':
      // Plain text: single cue spanning 0-Infinity
      return [{ startTime: 0, endTime: Infinity, text: content.trim() }];
    default:
      return parseSRT(content);
  }
}

/**
 * Detect subtitle format from content.
 */
function detectFormat(content: string): CaptionFormat {
  const trimmed = content.trim();
  if (trimmed.startsWith('WEBVTT')) return 'vtt';
  // SRT starts with a number (cue index)
  if (/^\d+\s*\n/.test(trimmed)) return 'srt';
  return 'plain';
}

/**
 * Get active cues at a given time in seconds.
 */
export function getActiveCues(cues: CaptionCue[], timeSeconds: number): CaptionCue[] {
  return cues.filter(
    (cue) => timeSeconds >= cue.startTime && timeSeconds < cue.endTime,
  );
}
