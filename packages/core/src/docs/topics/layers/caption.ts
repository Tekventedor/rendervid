import type { DocResult } from '../../types.js';

export function getCaptionLayerDocs(): DocResult {
  return {
    topic: 'layer/caption',
    title: 'Caption/Subtitle Layer',
    description: 'Timed subtitles/captions that appear and disappear based on timestamps. Supports SRT, VTT, and pre-parsed cue arrays.',
    properties: {
      content: { type: 'string', description: 'Raw subtitle content in SRT, VTT, or plain text format' },
      format: { type: 'string', description: 'Subtitle format (auto-detected if omitted)', values: ['srt', 'vtt', 'plain'] },
      cues: { type: 'CaptionCue[]', description: 'Pre-parsed cue array (alternative to content string)' },
      fontSize: { type: 'number', description: 'Font size in pixels', default: 32, example: 48 },
      fontFamily: { type: 'string', description: 'Font family', default: 'sans-serif' },
      fontWeight: { type: 'string', description: 'Font weight', values: ['normal', 'bold', '100-900'] },
      color: { type: 'string', description: 'Text color', default: '#ffffff' },
      backgroundColor: { type: 'string', description: 'Background color behind text', default: 'rgba(0, 0, 0, 0.75)' },
      textAlign: { type: 'string', description: 'Text alignment', default: 'center', values: ['left', 'center', 'right'] },
      padding: { type: 'number', description: 'Padding around text in pixels' },
      borderRadius: { type: 'number', description: 'Background border radius' },
      lineHeight: { type: 'number', description: 'Line height multiplier' },
    },
    sections: [
      {
        title: 'CaptionCue Structure',
        description: 'Each cue defines a timed text segment',
        properties: {
          startTime: { type: 'number', required: true, description: 'Start time in seconds', example: 1.0 },
          endTime: { type: 'number', required: true, description: 'End time in seconds', example: 4.0 },
          text: { type: 'string', required: true, description: 'Caption text content', example: 'Hello World' },
        },
      },
    ],
    tips: [
      'Provide either content (raw SRT/VTT string) or cues (pre-parsed array), not both',
      'SRT format is auto-detected - just paste raw subtitle content',
      'Position the caption layer at the bottom of the video for standard subtitle placement',
    ],
    examples: [
      {
        description: 'SRT-based captions',
        layer: {
          id: 'subtitles', type: 'caption',
          position: { x: 0, y: 800 }, size: { width: 1920, height: 280 },
          props: {
            content: '1\n00:00:01,000 --> 00:00:04,000\nHello World\n\n2\n00:00:05,000 --> 00:00:08,000\nWelcome to the video',
            format: 'srt', fontSize: 48, color: '#ffffff', backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        },
      },
      {
        description: 'Pre-parsed cues',
        layer: {
          id: 'subs', type: 'caption',
          position: { x: 0, y: 800 }, size: { width: 1920, height: 280 },
          props: {
            cues: [
              { startTime: 1, endTime: 4, text: 'Hello World' },
              { startTime: 5, endTime: 8, text: 'Welcome' },
            ],
            fontSize: 48, color: '#ffffff',
          },
        },
      },
    ],
    seeAlso: ['layer', 'layer/text'],
  };
}
