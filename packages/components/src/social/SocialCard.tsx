import React from 'react';
import type { AnimatedProps } from '../types';

export interface SocialCardProps extends AnimatedProps {
  /** Platform type */
  platform?: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'custom';
  /** Profile image URL */
  profileImage?: string;
  /** Username or account name */
  username?: string;
  /** Account handle (e.g., @username) */
  handle?: string;
  /** Post content */
  content: string;
  /** Post image URL */
  image?: string;
  /** Number of likes */
  likes?: number;
  /** Number of comments */
  comments?: number;
  /** Number of shares */
  shares?: number;
  /** Show engagement stats */
  showStats?: boolean;
  /** Card width */
  width?: number;
  /** Card height */
  height?: number;
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Accent color for platform branding */
  accentColor?: string;
  /** Font size */
  fontSize?: number;
  /** Border radius */
  borderRadius?: number;
  /** Animation duration in frames */
  animationDuration?: number;
}

const PLATFORM_COLORS = {
  twitter: '#1DA1F2',
  facebook: '#1877F2',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  custom: '#3b82f6',
};

/**
 * Social media post card component
 */
export function SocialCard({
  platform = 'custom',
  profileImage,
  username = 'User Name',
  handle = '@username',
  content,
  image,
  likes = 0,
  comments = 0,
  shares = 0,
  showStats = true,
  width = 600,
  height = 400,
  backgroundColor = '#ffffff',
  textColor = '#1a1a1a',
  accentColor,
  fontSize = 16,
  borderRadius = 12,
  animationDuration = 30,
  frame = 0,
  style,
  className,
}: SocialCardProps): React.ReactElement {
  const color = accentColor || PLATFORM_COLORS[platform];

  // Calculate animation progress
  const progress = Math.min(frame / animationDuration, 1);
  const opacity = progress;
  const scale = 0.9 + progress * 0.1;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        width,
        height,
        backgroundColor,
        borderRadius,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        opacity,
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* Profile Image */}
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: fontSize * 1.2,
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
        )}

        {/* User Info */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: fontSize * 1.1,
              fontWeight: 'bold',
              color: textColor,
              marginBottom: 2,
            }}
          >
            {username}
          </div>
          <div
            style={{
              fontSize: fontSize * 0.9,
              color: `${textColor}99`,
            }}
          >
            {handle}
          </div>
        </div>

        {/* Platform Badge */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: fontSize * 1.2,
            color: '#ffffff',
          }}
        >
          {platform === 'twitter' && '𝕏'}
          {platform === 'facebook' && 'f'}
          {platform === 'instagram' && '📷'}
          {platform === 'linkedin' && 'in'}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          fontSize,
          color: textColor,
          lineHeight: 1.5,
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {content}
      </div>

      {/* Post Image */}
      {image && (
        <img
          src={image}
          alt="Post"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: height * 0.4,
            objectFit: 'cover',
            borderRadius: borderRadius * 0.5,
          }}
        />
      )}

      {/* Engagement Stats */}
      {showStats && (
        <div
          style={{
            display: 'flex',
            gap: 24,
            paddingTop: 12,
            borderTop: `1px solid ${textColor}20`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: fontSize * 1.2 }}>❤️</span>
            <span style={{ fontSize: fontSize * 0.9, color: textColor }}>
              {formatNumber(likes)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: fontSize * 1.2 }}>💬</span>
            <span style={{ fontSize: fontSize * 0.9, color: textColor }}>
              {formatNumber(comments)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: fontSize * 1.2 }}>🔄</span>
            <span style={{ fontSize: fontSize * 0.9, color: textColor }}>
              {formatNumber(shares)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
