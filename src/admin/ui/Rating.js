import React from 'react';
import { default as ReactRating } from 'react-rating';

import { ReactComponent as Star } from '../assets/images/icon/star.svg';
import { ReactComponent as StarFull } from '../assets/images/icon/starFull.svg';

export const Rating = ({ stars = 0, ...otherProps }) => {
  return (
    <div>
      <ReactRating
        initialRating={stars}
        fractions={1}
        emptySymbol={<Star />}
        fullSymbol={<StarFull />}
        {...otherProps}
      />
    </div>
  );
};
