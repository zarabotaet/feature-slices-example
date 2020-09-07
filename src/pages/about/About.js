import React from 'react';
import clsx from 'clsx';

import {
  AddressSection,
  BrandValuesSection,
  HistorySection,
  MissionSection,
} from './Sections';

import { Container, Slider } from 'ui';

import sliderImg1 from 'assets/images/picture/about/sliderimg1.jpg';

import style from './about.module.scss';

const sliderImages = [
  {
    id: 1,
    img: sliderImg1,
  },
  {
    id: 2,
    img: sliderImg1,
  },
];

export function About() {
  return (
    <div className={style.about}>
      <div className={clsx('row', style.aboutTopHeader)}>
        <Container>
          <div className={style.fix}></div>
          <Slider slidesToShow={1} dots={true}>
            {sliderImages.map((item, index) => (
              <div key={item.id}>
                <img src={item.img} alt={index} />
              </div>
            ))}
          </Slider>
        </Container>
      </div>
      <Container>
        <MissionSection />
      </Container>
      <Container>
        <BrandValuesSection />
      </Container>
      <Container>
        <HistorySection />
      </Container>
      <div className={style.aboutMapWrapper}>
        <AddressSection />
      </div>
    </div>
  );
}
