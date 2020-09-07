import React from 'react';
import SliderS from 'react-slick';
import clsx from 'clsx';

import { Row } from 'ui/Grid/Row';

import { ReactComponent as Arrow } from 'assets/images/icon/Arrow.svg';

import 'slick-carousel/slick/slick.css';
import style from './slider.module.scss';

export function Slider({ children, className, ...settings }) {
  if (children.length < settings.slidesToShow)
    return (
      <Row justify="center" noWrap>
        {children}
      </Row>
    );

  return (
    <SliderS
      {...defaultSettings}
      {...settings}
      className={clsx(style.slider, className)}
    >
      {children}
    </SliderS>
  );
}

const defaultSettings = {
  infinite: true,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  dotsClass: style.customSlickDotsWrapper,
  customPaging: i => <div className={style.sliderCustomDots} key={i} />,
};

export function NextArrow({ onClick }) {
  return (
    <div onClick={onClick} className={style.arrowNext}>
      <Arrow />
    </div>
  );
}
export function PrevArrow({ onClick }) {
  return (
    <div onClick={onClick} className={style.arrowPrev}>
      <Arrow />
    </div>
  );
}
