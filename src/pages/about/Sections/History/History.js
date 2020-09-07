import React from 'react';

import { T8y } from 'ui';

import style from './History.module.scss';

export function HistorySection() {
  return (
    <div className={style.aboutHistory}>
      <T8y as="h2" variant="h1" color="primary">
        History
      </T8y>
      <div className={style.content}>
        <T8y variant="t1">
          The easy brand, founded by Sir Stelios Haji-ioannou, launched in 1995
          with the inaugural flight of an airline offering low cost travel
          across Europe -{' '}
          <T8y
            asLink
            color="primary"
            as="a"
            href="https://easyjet.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            easyJet
          </T8y>
          .
          <br />
          <br />
          Over 25 years later its transformed how people think about flying, and
          easyJet PLC is now of Europe's largest airlines with a fleet of 323
          aircraft carrying over 88.5 million passengers annuals (2018).
          <br />
          <br />
          The easy family of brands includes a wide range of businesses from{' '}
          <T8y
            asLink
            color="primary"
            as="a"
            href="https://easyhotel.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            easyHotel
          </T8y>{' '}
          to{' '}
          <T8y
            asLink
            color="primary"
            as="a"
            href="https://easybus.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            easyBus
          </T8y>{' '}
          to{' '}
          <T8y
            asLink
            color="primary"
            as="a"
            href="https://easygym.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            easyGym
          </T8y>{' '}
          and now has officially entered the event hire industry powered by{' '}
          <T8y
            asLink
            color="primary"
            as="a"
            href="http://rentuu.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Rentuu
          </T8y>{' '}
          technologies and{' '}
          <T8y
            asLink
            color="primary"
            as="a"
            href="http://eventhireuk.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Event Hire UK
          </T8y>
          .
        </T8y>
        <iframe
          title="0"
          src="https://player.vimeo.com/video/395258441?title=0&sidedock=0&controls=0"
          width="640"
          height="360"
          frameborder="0"
          webkitallowfullscreen
          mozallowfullscreen
          allowfullscreen
        ></iframe>
      </div>
    </div>
  );
}
