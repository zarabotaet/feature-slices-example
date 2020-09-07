import React from 'react';

import { T8y } from 'ui';

import style from './address.module.scss';

const addressData = [
  {
    id: 1,
    title: 'LONDON',
    address:
      'Units A, B & C, Hanworth Trading Estate, A312 / Hampton Road West, Hanworth, Middx, TW13 6DH',
  },
  {
    id: 2,
    title: 'NORTH WEST',
    address:
      'Unit 7, Stakehill Industrial Estate Finlan Road, Manchester M24 2RW',
  },
  {
    id: 3,
    title: 'SOUTH WEST',
    address: 'Unit 18, Hampton Park West Melksham, Wiltshire SN12 6LH',
  },
  {
    id: 4,
    title: 'MIDLANDS',
    address:
      'HQ & Showroom, Units 1 & 2 Maple Leaf Industrial Estate, Bloxwich Lane, Walsall, West Midlands WS2 8TF',
  },
  {
    id: 5,
    title: 'NORTH',
    address:
      'Unit 14, Enterprise Court, Prince Street, Bradford, West Yorkshire, BD4 6HQ',
  },
];

export function AddressSection() {
  return (
    <div className={style.aboutAddress}>
      <T8y as="h2" variant="h1" color="primary">
        Our depots are UK wide !
      </T8y>
      {addressData.map(el => (
        <div key={el.id} className={style.aboutAddressItem}>
          <T8y as="h3" variant="t2" bold>
            {el.title}
          </T8y>
          <T8y variant="t1">{el.address}</T8y>
        </div>
      ))}
    </div>
  );
}
