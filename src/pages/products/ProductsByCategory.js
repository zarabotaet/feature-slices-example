import React from 'react';
import clsx from 'clsx';
import { useGate, useStore } from 'effector-react';
import { Meta } from 'seo';

import { DiscountBadge } from 'features/discount';
import { SubCategoriesChecker } from 'features/filter';
import {
  categoryGate,
  HeaderProducts,
  PopularProducts,
  productsByCategory$,
  productsByCategoryLoading$,
  productsTotalPages$,
  RightMenu,
} from 'features/products';

import { CardsGrid } from './CardsGrid/CardsGrid';
import { SeoText } from './SeoText';

import { Pagination } from 'ui';

import style from './products.module.scss';

export function ProductsByCategory({ match, location }) {
  useGate(categoryGate, { params: match.params });

  return (
    <div className="d-flex">
      <Meta category={match.params.category} />
      <div className={clsx('container', style.wrapProducts)}>
        <DiscountBadge />
        <HeaderProducts />
        <SubCategoriesChecker />
        <ProductsModule category={match.params.category} />
        <ProductsPagination match={match} location={location} />
        <PopularProducts className={style.slider} />
        <SeoText category={match.params.category} />
      </div>
      <RightMenu />
    </div>
  );
}

function ProductsPagination({ match, location }) {
  const totalPages = useStore(productsTotalPages$);

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
  const cards = useStore(productsByCategory$);
  const loading = useStore(productsByCategoryLoading$);

  return (
    <div className={style.cardModule}>
      <CardsGrid cardsLength={16} cards={cards} loading={loading} />
    </div>
  );
}
