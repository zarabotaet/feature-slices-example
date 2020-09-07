import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import {
  changePackage,
  changeSortby,
  packagesData$,
  selectedPackageName$,
  selectedSortby$,
  sortbyData,
} from 'features/filter';
import { currentCategory$ } from 'features/products';

import { Field, inputStyle, Row, Select, T8y } from 'ui';

import { ReactComponent as GoBackArrow } from 'assets/images/icon/GoBackArrow.svg';
import { ReactComponent as PkgIcon } from 'assets/images/icon/package.svg';
import { ReactComponent as SortIcon } from 'assets/images/icon/sorting.svg';

import style from './headerProducts.module.scss';

export function HeaderProducts({
  children,
  stepBack,
  title = 'All suitable products',
}) {
  const category = useStore(currentCategory$);

  return (
    <div className={clsx('row', style.header)}>
      <div className="col-12">
        {category?.name && (
          <T8y
            as={Link}
            to={PATHS.PRODUCTS}
            variant="t2"
            className={clsx('nav-link', style.goBack)}
          >
            <Row align="center">
              All products
              <GoBackArrow />
            </Row>
          </T8y>
        )}
        <T8y as="h2" variant="h1" color="primary">
          {category?.name || title}
        </T8y>
      </div>
      <div className="col-12 row" justify="stretch">
        <Packages className="col-sm-6 col-lg-3 col-12 mb-3 mb-sm-0" />
        <Sort className="col-sm-6 col-12 col-lg-3 mb-3 mb-sm-0" />
      </div>
    </div>
  );
}

const Packages = ({ className = '' }) => {
  const selectedPackage = useStore(selectedPackageName$);
  const packagesData = useStore(packagesData$);

  return (
    <Field legend="Event types" className={className} icon={PkgIcon}>
      <Select
        options={packagesData}
        selected={selectedPackage}
        aLabel="Package"
        onClickOption={changePackage}
        className={inputStyle}
      />
    </Field>
  );
};

const Sort = ({ className = '' }) => {
  const selectedSortby = useStore(selectedSortby$);

  return (
    <Field legend="Sort by" className={className} icon={SortIcon}>
      <Select
        options={sortbyData}
        selected={selectedSortby}
        aLabel="Package"
        onClickOption={changeSortby}
        className={inputStyle}
      />
    </Field>
  );
};
