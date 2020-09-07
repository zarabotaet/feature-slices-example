import React from 'react';

import { ReactComponent as EmptyStar } from 'assets/images/icon/stars/EmptyStar.svg';
import { ReactComponent as FilledStart } from 'assets/images/icon/stars/FilledStar.svg';
import { ReactComponent as HalfFilledStar } from 'assets/images/icon/stars/HalfFilledStar.svg';
import { ReactComponent as WhiteStar } from 'assets/images/icon/stars/whiteStar.svg';

export function Rating({ count = 5, rating, size = 17, className = '' }) {
  if (!rating) return <div className={className}>{getStartStars(count)}</div>;
  return (
    <div className={className}>
      {mapStars(rating, count).map((e, i) => (
        <Star
          key={i}
          type={e}
          style={{ width: `${size / 10}rem`, height: `${size / 10}rem` }}
        />
      ))}
    </div>
  );
}

function mapStars(rating, count) {
  const ratingRounded = Math.round(rating * 2) / 2;
  return [
    ...getFillStars(ratingRounded),
    ...getHalfStars((ratingRounded % 1) * 2),
    ...getEmptyStars(count - ratingRounded),
  ];
}
function getFillStars(length) {
  return Array.from({ length }, () => 'filled');
}
function getEmptyStars(length) {
  return Array.from({ length }, () => 'empty');
}
function getHalfStars(length) {
  return Array.from({ length }, () => 'half');
}

function getStartStars(count) {
  return Array.from({ length: count }, (el, i) => <Star key={i} />);
}

function Star({ type, style }) {
  switch (type) {
    case 'filled':
      return <FilledStart style={style} />;
    case 'half':
      return <HalfFilledStar style={style} />;
    case 'empty':
      return <EmptyStar style={style} />;
    default:
      return <WhiteStar style={style} />;
  }
}
