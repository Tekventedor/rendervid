import React from 'react';
import type { AnimatedProps } from '../types';

export interface ProductCardProps extends AnimatedProps {
  /** Product name */
  name: string;
  /** Product description */
  description?: string;
  /** Product image URL */
  image: string;
  /** Price */
  price: number;
  /** Original price (for showing discount) */
  originalPrice?: number;
  /** Currency symbol */
  currency?: string;
  /** Product rating (0-5) */
  rating?: number;
  /** Number of reviews */
  reviews?: number;
  /** Badge text (e.g., "New", "Sale", "Limited") */
  badge?: string;
  /** Badge color */
  badgeColor?: string;
  /** Card width */
  width?: number;
  /** Card height */
  height?: number;
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Accent color for buttons and highlights */
  accentColor?: string;
  /** Font size */
  fontSize?: number;
  /** Border radius */
  borderRadius?: number;
  /** Show CTA button */
  showButton?: boolean;
  /** Button text */
  buttonText?: string;
  /** Animation duration in frames */
  animationDuration?: number;
}

/**
 * Product showcase card component
 */
export function ProductCard({
  name,
  description,
  image,
  price,
  originalPrice,
  currency = '$',
  rating,
  reviews,
  badge,
  badgeColor = '#ef4444',
  width = 400,
  height = 600,
  backgroundColor = '#ffffff',
  textColor = '#1a1a1a',
  accentColor = '#3b82f6',
  fontSize = 16,
  borderRadius = 12,
  showButton = true,
  buttonText = 'Shop Now',
  animationDuration = 40,
  frame = 0,
  style,
  className,
}: ProductCardProps): React.ReactElement {
  // Calculate animation progress
  const progress = Math.min(frame / animationDuration, 1);
  const imageScale = 0.95 + progress * 0.05;
  const contentOpacity = Math.max(0, Math.min(1, (progress - 0.3) * 2));
  const buttonScale = Math.max(0, Math.min(1, (progress - 0.6) * 2.5));

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('⭐');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('⭐'); // Could use half star emoji if available
      } else {
        stars.push('☆');
      }
    }

    return stars.join('');
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
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        ...style,
      }}
    >
      {/* Image Section */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: height * 0.55,
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imageScale})`,
            transition: 'transform 0.3s ease',
          }}
        />

        {/* Badge */}
        {badge && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: badgeColor,
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: fontSize * 0.85,
              fontWeight: 'bold',
              opacity: contentOpacity,
            }}
          >
            {badge}
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: '#10b981',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: fontSize * 0.85,
              fontWeight: 'bold',
              opacity: contentOpacity,
            }}
          >
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Content Section */}
      <div
        style={{
          flex: 1,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          opacity: contentOpacity,
        }}
      >
        {/* Product Name */}
        <h3
          style={{
            fontSize: fontSize * 1.3,
            fontWeight: 'bold',
            color: textColor,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p
            style={{
              fontSize: fontSize * 0.9,
              color: `${textColor}cc`,
              margin: 0,
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            {description}
          </p>
        )}

        {/* Rating */}
        {rating !== undefined && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: fontSize * 0.85,
            }}
          >
            <span style={{ color: '#fbbf24' }}>{renderStars(rating)}</span>
            {reviews !== undefined && (
              <span style={{ color: `${textColor}99` }}>({reviews})</span>
            )}
          </div>
        )}

        {/* Price Section */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span
            style={{
              fontSize: fontSize * 1.8,
              fontWeight: 'bold',
              color: accentColor,
            }}
          >
            {currency}
            {price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span
              style={{
                fontSize: fontSize * 1.1,
                color: `${textColor}66`,
                textDecoration: 'line-through',
              }}
            >
              {currency}
              {originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* CTA Button */}
        {showButton && (
          <button
            style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: accentColor,
              color: '#ffffff',
              border: 'none',
              borderRadius: borderRadius * 0.5,
              fontSize: fontSize * 1.1,
              fontWeight: 'bold',
              cursor: 'pointer',
              transform: `scale(${buttonScale})`,
              opacity: buttonScale,
            }}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
