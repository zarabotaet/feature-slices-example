import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';
import { useGate, useStore } from 'effector-react';

import { searchStr$ } from 'features/filter';
import { HeaderProducts, PopularProducts, RightMenu } from 'features/products';
import {
  getProductsBySearchFx,
  isNothingFind$,
  productsBySearch$,
  productsBySearchPages$,
  searchGate,
} from 'features/search';

import { CardsGrid } from './CardsGrid/CardsGrid';

import { Pagination, Row, T8y } from 'ui';

import style, { wrapProducts } from './products.module.scss';

export function SearchPage({ match, location }) {
  useGate(searchGate, { params: match.params });
  const searchStr = useStore(searchStr$);
  const isNothingFind = useStore(isNothingFind$);

  return (
    <div className="d-flex">
      <div className={clsx('container', wrapProducts)}>
        <HeaderProducts title={`Search result "${searchStr}"`} />
        {isNothingFind && <NothinFound />}
        <ProductsModule category={match.params.category} />
        <ProductsPagination match={match} location={location} />
        <PopularProducts className={style.slider} />
      </div>
      <RightMenu />
    </div>
  );
}

function ProductsPagination({ match, location }) {
  const totalPages = useStore(productsBySearchPages$);

  return (
    <Pagination
      currentPage={match.params.page}
      path={match.url}
      search={location.search}
      totalPages={totalPages}
    />
  );
}

function ProductsModule() {
  const cards = useStore(productsBySearch$);
  const loading = useStore(getProductsBySearchFx.pending);

  return (
    <div className={style.cardModule}>
      <CardsGrid cardsLength={16} cards={cards} loading={loading} />
    </div>
  );
}

function NothinFound() {
  return (
    <Row justify="center" className={style.emptyBadge}>
      <T8y bold variant="h2">
        Nothing found. Please browse our{' '}
        <T8y as={Link} to={PATHS.PRODUCTS} variant="h2" color="primary" asLink>
          catalogue
        </T8y>{' '}
        or change search query.
      </T8y>
    </Row>
  );
}
