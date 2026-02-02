/**
 * Example usage of LottieAnimation component
 *
 * This example demonstrates how to use the LottieAnimation component
 * to render Lottie/After Effects animations in your videos.
 */

import React from 'react';
import { LottieAnimation } from '@rendervid/components';

// Example 1: Load from URL
export function LottieFromURL({ frame }: { frame: number }) {
  return (
    <LottieAnimation
      src="https://assets.example.com/animation.json"
      frame={frame}
      totalFrames={120}
      fps={30}
      speed={1}
      loop={true}
      width={400}
      height={400}
    />
  );
}

// Example 2: Load from inline data
const animationData = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 500,
  h: 500,
  // ... rest of your Lottie JSON data
};

export function LottieFromData({ frame }: { frame: number }) {
  return (
    <LottieAnimation
      animationData={animationData}
      frame={frame}
      totalFrames={120}
      speed={1}
      loop={true}
      width="100%"
      height="100%"
    />
  );
}

// Example 3: With custom speed and no looping
export function LottieFastNoLoop({ frame }: { frame: number }) {
  return (
    <LottieAnimation
      src="https://assets.example.com/animation.json"
      frame={frame}
      totalFrames={60}
      speed={2} // 2x speed
      loop={false} // Don't loop, hold on last frame
      width={600}
      height={600}
    />
  );
}

// Example 4: Responsive with styling
export function LottieStyled({ frame }: { frame: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <LottieAnimation
        src="https://assets.example.com/animation.json"
        frame={frame}
        totalFrames={120}
        speed={1}
        loop={true}
        width="80%"
        height="80%"
        style={{
          maxWidth: '800px',
          maxHeight: '800px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );
}

/**
 * Note: To use LottieAnimation, you need to install lottie-web:
 *
 * npm install lottie-web
 *
 * Or with yarn:
 * yarn add lottie-web
 *
 * Or with pnpm:
 * pnpm add lottie-web
 *
 * If lottie-web is not installed, the component will display a
 * placeholder with installation instructions.
 */
