import React from 'react';

import { ReactComponent as ListBasket } from 'assets/images/icon/ListBasket.svg';
import { ReactComponent as ListOrders } from 'assets/images/icon/ListOrders.svg';
import { ReactComponent as ListShop } from 'assets/images/icon/ListShop.svg';

import style from '../blockInfo.module.scss';

export function CustomList() {
  return (
    <div>
      <div className={style.flex_}>
        <div className={style.item}>
          <div className={style.wart}>1</div>
          <ListBasket />
        </div>
        <div>
          <div className={style.title}>Find what your looking for</div>
          <div className={style.text}>
            Browse and shop our inventory with no nonsense pricing to decide on
            what you want to hire.
          </div>
        </div>
      </div>

      <div
        className={style.flex_}
        style={{
          marginTop: 31,
          marginBottom: 31,
        }}
      >
        <div className={style.item}>
          <div className={style.wart}>2</div>
          <ListOrders />
        </div>
        <div>
          <div className={style.title}>View quote calculator</div>
          <div className={style.text}>
            Submitting your event details to view a full pricing breakdown
            including delivery and collection.
          </div>
        </div>
      </div>

      <div className={style.flex_}>
        <div className={style.item}>
          <div className={style.wart}>3</div>
          <ListShop />
        </div>
        <div>
          <div className={style.title}>Pay now or pay later</div>
          <div className={style.text}>
            Confirm your booking by paying now online or freeze the price and
            pay later if your event is more than 2 weeks away.
          </div>
        </div>
      </div>
    </div>
  );
}
