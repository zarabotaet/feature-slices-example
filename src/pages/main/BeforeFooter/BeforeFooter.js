import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { PATHS } from '../../../AppPaths';
import { filterSearchString$ } from '../../../features/filter/filterModel';

import { Button } from 'ui';

import { ReactComponent as Calculator } from 'assets/images/icon/calculator.svg';
import { ReactComponent as GoUp } from 'assets/images/icon/goUp.svg';

import style from './beforeFooter.module.scss';

export function BeforeFooter() {
  const params = useStore(filterSearchString$);
  const goUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={style.beforeFooter}>
      <div className="container">
        <div className="row ">
          <div className="col d-flex flex-column flex-md-row justify-content-center align-items-center my-2">
            <div className={style.calculator}>
              <Calculator />
            </div>
            <div className="d-flex justify-content-center align-items-center my-2">
              <div className={style.text}>
                Get&nbsp;
                <span className={clsx('text-primary', style.link)}>
                  instant quote
                </span>
                &nbsp; for your event &nbsp;
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center my-2">
              <Button
                className={style.goToCalculator}
                as={Link}
                to={`${PATHS.PRODUCTS}?${params}`}
              >
                Browse Now
              </Button>

              <button
                className={clsx('d-none d-md-block', style.goUp)}
                onClick={goUp}
              >
                <GoUp />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
