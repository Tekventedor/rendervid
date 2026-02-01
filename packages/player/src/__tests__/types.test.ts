import { describe, it, expect } from 'vitest';
import type {
  PlaybackState,
  PlaybackControls,
  UsePlaybackOptions,
  PlayerProps,
  TimelineProps,
  ControlsProps,
  ScrubberProps,
  SceneInfo,
} from '../types';
import type { Template } from '@rendervid/core';

describe('Player Types', () => {
  describe('PlaybackState', () => {
    it('should have all required properties', () => {
      const state: PlaybackState = {
        isPlaying: false,
        currentFrame: 0,
        totalFrames: 300,
        currentTime: 0,
        duration: 10,
        fps: 30,
        loop: false,
        speed: 1,
        volume: 1,
        muted: false,
      };

      expect(state.isPlaying).toBe(false);
      expect(state.currentFrame).toBe(0);
      expect(state.totalFrames).toBe(300);
      expect(state.duration).toBe(10);
      expect(state.fps).toBe(30);
      expect(state.speed).toBe(1);
      expect(state.volume).toBe(1);
      expect(state.muted).toBe(false);
    });
  });

  describe('PlaybackControls', () => {
    it('should have all control methods', () => {
      const controls: PlaybackControls = {
        play: () => {},
        pause: () => {},
        toggle: () => {},
        stop: () => {},
        seekToFrame: () => {},
        seekToTime: () => {},
        nextFrame: () => {},
        prevFrame: () => {},
        setSpeed: () => {},
        setVolume: () => {},
        toggleMute: () => {},
        setLoop: () => {},
      };

      expect(typeof controls.play).toBe('function');
      expect(typeof controls.pause).toBe('function');
      expect(typeof controls.toggle).toBe('function');
      expect(typeof controls.stop).toBe('function');
      expect(typeof controls.seekToFrame).toBe('function');
      expect(typeof controls.seekToTime).toBe('function');
      expect(typeof controls.nextFrame).toBe('function');
      expect(typeof controls.prevFrame).toBe('function');
      expect(typeof controls.setSpeed).toBe('function');
      expect(typeof controls.setVolume).toBe('function');
      expect(typeof controls.toggleMute).toBe('function');
      expect(typeof controls.setLoop).toBe('function');
    });
  });

  describe('UsePlaybackOptions', () => {
    it('should support required and optional properties', () => {
      // Minimal options
      const minimalOptions: UsePlaybackOptions = {
        totalFrames: 300,
      };
      expect(minimalOptions.totalFrames).toBe(300);

      // Full options
      const fullOptions: UsePlaybackOptions = {
        totalFrames: 300,
        fps: 60,
        loop: true,
        initialSpeed: 1.5,
        autoplay: true,
        onComplete: () => {},
        onFrameChange: () => {},
      };
      expect(fullOptions.fps).toBe(60);
      expect(fullOptions.loop).toBe(true);
      expect(fullOptions.initialSpeed).toBe(1.5);
      expect(fullOptions.autoplay).toBe(true);
    });
  });

  describe('PlayerProps', () => {
    it('should support required template property', () => {
      const template: Template = {
        name: 'Test',
        output: {
          type: 'video',
          width: 1920,
          height: 1080,
          fps: 30,
        },
        inputs: [],
        composition: {
          scenes: [
            {
              id: 'scene-1',
              startFrame: 0,
              endFrame: 300,
              layers: [],
            },
          ],
        },
      };

      const props: PlayerProps = {
        template,
      };

      expect(props.template).toBe(template);
    });

    it('should support all optional properties', () => {
      const template: Template = {
        name: 'Test',
        output: {
          type: 'video',
          width: 1920,
          height: 1080,
        },
        inputs: [],
        composition: { scenes: [] },
      };

      const props: PlayerProps = {
        template,
        inputs: { title: 'Hello' },
        width: 800,
        height: 450,
        controls: true,
        autoplay: false,
        loop: true,
        speed: 1.5,
        className: 'my-player',
        style: { border: '1px solid red' },
        onComplete: () => {},
        onFrameChange: () => {},
        onPlayStateChange: () => {},
        renderLayer: () => null,
      };

      expect(props.width).toBe(800);
      expect(props.height).toBe(450);
      expect(props.controls).toBe(true);
      expect(props.loop).toBe(true);
      expect(props.speed).toBe(1.5);
    });
  });

  describe('TimelineProps', () => {
    it('should have all required properties', () => {
      const props: TimelineProps = {
        currentFrame: 100,
        totalFrames: 300,
        scenes: [
          { id: '1', startFrame: 0, endFrame: 150, layers: [] },
          { id: '2', startFrame: 150, endFrame: 300, layers: [] },
        ],
        fps: 30,
        onSeek: () => {},
        isPlaying: false,
      };

      expect(props.currentFrame).toBe(100);
      expect(props.totalFrames).toBe(300);
      expect(props.scenes.length).toBe(2);
      expect(props.fps).toBe(30);
    });

    it('should support optional properties', () => {
      const props: TimelineProps = {
        currentFrame: 0,
        totalFrames: 300,
        scenes: [],
        fps: 30,
        onSeek: () => {},
        isPlaying: false,
        className: 'timeline',
        showSceneMarkers: true,
        showTimeLabels: false,
      };

      expect(props.showSceneMarkers).toBe(true);
      expect(props.showTimeLabels).toBe(false);
    });
  });

  describe('ControlsProps', () => {
    it('should have required state and controls', () => {
      const state: PlaybackState = {
        isPlaying: true,
        currentFrame: 50,
        totalFrames: 300,
        currentTime: 1.67,
        duration: 10,
        fps: 30,
        loop: false,
        speed: 1,
        volume: 1,
        muted: false,
      };

      const controls: PlaybackControls = {
        play: () => {},
        pause: () => {},
        toggle: () => {},
        stop: () => {},
        seekToFrame: () => {},
        seekToTime: () => {},
        nextFrame: () => {},
        prevFrame: () => {},
        setSpeed: () => {},
        setVolume: () => {},
        toggleMute: () => {},
        setLoop: () => {},
      };

      const props: ControlsProps = {
        state,
        controls,
      };

      expect(props.state.isPlaying).toBe(true);
      expect(typeof props.controls.play).toBe('function');
    });

    it('should support optional display flags', () => {
      const props: ControlsProps = {
        state: {} as PlaybackState,
        controls: {} as PlaybackControls,
        className: 'controls',
        showSpeedControl: true,
        showVolumeControl: false,
        showFrameCounter: true,
      };

      expect(props.showSpeedControl).toBe(true);
      expect(props.showVolumeControl).toBe(false);
      expect(props.showFrameCounter).toBe(true);
    });
  });

  describe('ScrubberProps', () => {
    it('should have required value and onChange', () => {
      const props: ScrubberProps = {
        value: 0.5,
        onChange: () => {},
      };

      expect(props.value).toBe(0.5);
      expect(typeof props.onChange).toBe('function');
    });

    it('should support scrubbing callbacks', () => {
      const props: ScrubberProps = {
        value: 0.75,
        onChange: () => {},
        isScrubbing: true,
        onScrubStart: () => {},
        onScrubEnd: () => {},
        className: 'scrubber',
      };

      expect(props.isScrubbing).toBe(true);
      expect(typeof props.onScrubStart).toBe('function');
      expect(typeof props.onScrubEnd).toBe('function');
    });
  });

  describe('SceneInfo', () => {
    it('should represent scene display information', () => {
      const info: SceneInfo = {
        id: 'scene-1',
        name: 'Intro Scene',
        startFrame: 0,
        endFrame: 90,
        duration: 90,
        isActive: true,
      };

      expect(info.id).toBe('scene-1');
      expect(info.name).toBe('Intro Scene');
      expect(info.duration).toBe(90);
      expect(info.isActive).toBe(true);
    });

    it('should allow optional name', () => {
      const info: SceneInfo = {
        id: 'scene-2',
        startFrame: 90,
        endFrame: 180,
        duration: 90,
        isActive: false,
      };

      expect(info.name).toBeUndefined();
      expect(info.isActive).toBe(false);
    });
  });
});
