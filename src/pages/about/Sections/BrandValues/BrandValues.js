import React from 'react';

import { Row, T8y } from 'ui';

import { ReactComponent as ic1 } from 'assets/images/icon/brand-values/ic1.svg';
import { ReactComponent as ic2 } from 'assets/images/icon/brand-values/ic2.svg';
import { ReactComponent as ic3 } from 'assets/images/icon/brand-values/ic3.svg';
import { ReactComponent as ic4 } from 'assets/images/icon/brand-values/ic4.svg';
import { ReactComponent as ic5 } from 'assets/images/icon/brand-values/ic5.svg';
import { ReactComponent as ic6 } from 'assets/images/icon/brand-values/ic6.svg';
import { ReactComponent as ic7 } from 'assets/images/icon/brand-values/ic7.svg';
import { ReactComponent as ic8 } from 'assets/images/icon/brand-values/ic8.svg';

import style from './BrandValues.module.scss';

const valuesData = [
  {
    id: 1,
    title: 'Great Value',
    icon: ic1,
  },
  {
    id: 2,
    title: 'Taking on the big boys',
    icon: ic2,
  },
  {
    id: 3,
    title: 'For the many not the few',
    icon: ic3,
  },
  {
    id: 4,
    title: 'Relentless innovation',
    icon: ic4,
  },
  {
    id: 5,
    title: 'Keep it simple',
    icon: ic5,
  },
  {
    id: 6,
    title: 'Entrepreneurial',
    icon: ic6,
  },
  {
    id: 7,
    title: 'Making the difference in people’s lives',
    icon: ic7,
  },
  {
    id: 8,
    title: 'Honest, Open, Caring and Fun',
    icon: ic8,
  },
];

export function BrandValuesSection() {
  return (
    <div className={style.aboutBrand}>
      <T8y as="h2" variant="h1" color="primary">
        Brand Values
      </T8y>
      <Row className={style.aboutBrandValuesWrapper} justify="stretch">
        {valuesData.map((el, index) => (
          <Row
            align="center"
            noWrap
            key={el.id}
            className={style.aboutBrandItem}
          >
            <Row
              align="center"
              justify="center"
              className={style.aboutBrandItemIcon}
            >
              <el.icon />
              <div className={style.aboutBrandItemIconNumber}>
                <span>{el.id}.</span>
              </div>
            </Row>
            <T8y as="h3" variant="t2" bold>
              {el.title}
            </T8y>
          </Row>
        ))}
      </Row>
    </div>
  );
}
