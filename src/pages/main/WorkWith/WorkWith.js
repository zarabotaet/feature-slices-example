import React from 'react';
import clsx from 'clsx';

import { Row, T8y } from 'ui';

import style from './workWith.module.scss';

export function WorkWith({ data = [] }) {
  return (
    <div>
      <div className="container">
        <T8y variant="h1" regular className={style.workWithTitle}>
          Proud to work with
        </T8y>
        <Row noWrap align="stretch" className={style.brands}>
          {data.map((src, i) => {
            return (
              <Row
                align="center"
                justify="center"
                className={clsx(
                  'col-6 col-lg-3 col-md-4',
                  style.brend,
                  i % 2 === 0 ? style.brendGray : '',
                )}
                key={src}
              >
                <img src={src} alt="" />
              </Row>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
