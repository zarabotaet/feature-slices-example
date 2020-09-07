import React from 'react';
import clsx from 'clsx';

import approved from 'assets/images/picture/approved.png';
import eha from 'assets/images/picture/eha.png';
import pricebeat from 'assets/images/picture/pricebeat.png';
import safehire from 'assets/images/picture/safehire.png';

import style from './addressList.module.scss';

export const AddressList = ({ data = [] }) => (
  <div className={style.addressList}>
    <div className={style.title}>Our depots are UK wide !</div>
    <div className={style.infoList}>
      {data.map(item => (
        <div className={style.infoItem} key={item.address}>
          <div className={style.region}>
            <span>{item.region ? item.region.toUpperCase() : item.region}</span>
          </div>
          <div className={style.address}>{item.address}</div>
        </div>
      ))}
    </div>
    <div className={clsx('d-none d-lg-block', style.certified)}>
      <div className={style.certifiedTitle}>Certified partner</div>
      <div className={style.certifiedList}>
        <img src={approved} alt="" />
        <img src={eha} alt="" />
        <img src={safehire} alt="" />
        <img src={pricebeat} alt="" />
      </div>
    </div>
  </div>
);
