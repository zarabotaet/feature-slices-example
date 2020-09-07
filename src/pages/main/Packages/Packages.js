import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from 'AppPaths';
import { useStore } from 'effector-react';

import { changePackage, packages$ } from 'features/filter';

import { Button, Row, T8y } from 'ui';

import { ReactComponent as Stars } from 'assets/images/icon/Star.svg';

import style from './packages.module.scss';

export function Packages() {
  const [numb, setnumb] = React.useState(3);

  const packages = useStore(packages$);
  const filterPackages = packages.filter((e, i) => i < numb);

  return (
    <div className={style.packageMain}>
      <div className="container">
        <T8y variant="h1" regular className={style.packageTitle}>
          Event Types
        </T8y>
        <div className="row flex-column flex-md-row pb-3">
          {filterPackages.map((item, i) => (
            <div key={i} className={'col col-lg-4 col-md-6 my-3'}>
              {i === 2 && <NewArrivals />}
              <Link
                to={`${PATHS.PRODUCTS}?pkg=${item.value}`}
                onClick={() => changePackage(item.value)}
              >
                <img className={style.img} src={item.src} alt={''} />
                <T8y variant="h1" color="light" className={style.title}>
                  {item.value}
                </T8y>
              </Link>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col d-flex justify-content-center justify-content-lg-end">
            {packages.length > numb && (
              <Button inverse onClick={() => setnumb(e => e + 3)}>
                Show More Event Types
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewArrivals() {
  return (
    <Row
      align="center"
      as={T8y}
      variant="t1"
      color="light"
      className={style.newArrivals}
    >
      <Stars />
      <span className="ml-3">New arrivals!</span>
    </Row>
  );
}
