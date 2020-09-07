import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';
import { useList } from 'effector-react';

import { categories$ } from 'features/products';

import { ReactComponent as Star } from 'assets/images/icon/Star.svg';
import cardbg_1 from 'assets/images/picture/PackagesBackgroundV1.svg';
import cardbg_2 from 'assets/images/picture/PackagesBackgroundV2.svg';
import cardbg_3 from 'assets/images/picture/PackagesBackgroundV3.svg';

import style from './topCards.module.scss';

export function TopCards() {
  return (
    <div className={clsx('row', style.section)}>
      {useList(categories$, ({ name, slug, src }, i) => (
        <div className="col col-md-6 col-lg-4 my-3">
          <TopCard
            title={name}
            i={i}
            badge={i === 2}
            key={slug}
            slug={slug}
            src={src}
          />
        </div>
      ))}
    </div>
  );
}

function TopCard({ badge, i, title, slug, src }) {
  return (
    <Link to={PATHS.CATEGORY(slug)} className={style.card}>
      <div
        className={style.img}
        style={{
          backgroundImage: `url("${src}")`,
        }}
      ></div>
      <div
        className={style.title}
        style={{
          backgroundImage: `url("${bgs[i % 3]}")`,
        }}
      >
        {title}
      </div>
      {badge && (
        <div className={style.badge}>
          <Star />
          <span>New arrivals!</span>
        </div>
      )}
    </Link>
  );
}

const bgs = [cardbg_1, cardbg_2, cardbg_3];
