import React from 'react';

interface Props {
  rating: number;
  size?: 'sm' | 'md';
}

const StarRating: React.FC<Props> = ({ rating, size = 'md' }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fill = i <= Math.round(rating) ? '#f59e0b' : '#d1d5db';
    stars.push(
      <svg
        key={i}
        width={size === 'sm' ? 12 : 16}
        height={size === 'sm' ? 12 : 16}
        viewBox="0 0 24 24"
        fill={fill}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
      {stars}
      <span style={{ marginLeft: 4, fontSize: size === 'sm' ? 12 : 14, color: '#6b7280' }}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
};

export default StarRating;
