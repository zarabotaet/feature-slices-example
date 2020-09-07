import React from 'react';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';
import { useGate, useList, useStore } from 'effector-react';

import { DiscountBadge } from 'features/discount';
import {
  allProducts$,
  allProductsLoading$,
  HeaderProducts,
  PopularProducts,
  productsGate,
  RightMenu,
} from 'features/products';

import { CardsGrid } from './CardsGrid/CardsGrid';
import { TopCards } from './TopCards/TopCards';

import { Row, T8y } from 'ui';

import style from './products.module.scss';

export function Products() {
  useGate(productsGate);

  return (
    <Row>
      <div className={clsx('container', style.wrapProducts)}>
        <TopCards />
        <DiscountBadge />
        <HeaderProducts />
        {useList(allProducts$, products => (
          <ProductsModule {...products} />
        ))}
        <PopularProducts className={style.slider} />
      </div>
      <RightMenu />
    </Row>
  );
}

function ProductsModule({ cards, category, meta }) {
  const loading = useStore(allProductsLoading$);

  if (!meta?.total) return null;

  return (
    <>
      <Row align="center" className={style.cardModule}>
        <T8y as="h3" variant="h1" regular className={style.cardModuleTitle}>
          {category?.name}
        </T8y>
        <T8y variant="t2" className={style.cardModuleMore}>
          {meta?.total} items
        </T8y>
      </Row>
      <CardsGrid
        showMoreLink={PATHS.CATEGORY(category?.slug)}
        cards={cards}
        cardsLength={11}
        loading={loading}
      />
    </>
  );
}
