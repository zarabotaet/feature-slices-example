import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';

import { Rating } from 'ui';

import {
  body,
  footer,
  noImg,
  priceTitle,
  productCard,
  productPrice,
  skeleton,
  topHeader,
} from './productCard.module.scss';

export function ProductCard({
  slug,
  name,
  rating,
  img,
  image = img,
  price,
  loading,
}) {
  return (
    <Link
      to={PATHS.PRODUCT(slug)}
      className={clsx(productCard, {
        [noImg]: !image,
        [skeleton]: loading,
      })}
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className={topHeader}>
        <Rating rating={rating} />
        <div className={productPrice}>
          <span>£{price || '?'}</span>
          <span className={priceTitle}>per week</span>
        </div>
      </div>
      <div className={body}></div>
      <div className={footer}>{name || 'No title'}</div>
    </Link>
  );
}
