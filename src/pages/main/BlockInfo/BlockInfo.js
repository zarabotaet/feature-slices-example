import React from 'react';
import clsx from 'clsx';

import { AddressList } from './AddressList/AddressList';
import { CustomList } from './CustomList/CustomList';

import approved from 'assets/images/picture/approved.png';
import eha from 'assets/images/picture/eha.png';
import imageRight from 'assets/images/picture/HowItWorkImg1.jpg';
import Map from 'assets/images/picture/Map.jpg';
import pricebeat from 'assets/images/picture/pricebeat.png';
import safehire from 'assets/images/picture/safehire.png';

import style from './blockInfo.module.scss';

export function BlockInfo() {
  return (
    <div className={style.blockInfo}>
      <div className="container">
        <div className="row flex-column flex-lg-row">
          <div className="col col-lg-6 mb-5">
            <div className={style.infoTitle}>How it works</div>
            <CustomList />
          </div>
          <div
            className={clsx('col col-lg-6 d-none d-lg-block', style.rightImage)}
            style={{ backgroundImage: `url('${imageRight}')` }}
          />
          <img className="d-block d-lg-none mx-auto" src={imageRight} alt="" />
        </div>
        <div id="branch-locator" className="row flex-column flex-lg-row">
          <div className="col col-lg-6 order-2 order-lg-1 pl-0 pr-0 pl-md-4 pr-md-4">
            <div
              className={clsx('d-none d-lg-block', style.leftImage)}
              style={{ backgroundImage: `url('${Map}')` }}
            />
            <img className="d-block d-lg-none mx-auto" src={Map} alt="" />
          </div>
          <div className="col col-lg-6 order-1 order-lg-2">
            <AddressList data={AddressListData} />
          </div>
        </div>
        <div className="row d-block d-lg-none mt-4">
          <div className="col">
            <div className={style.certifiedTitle}>Certified partner</div>
            <div className="d-flex flex-wrap">
              <img className="m-2" src={approved} alt="" />
              <img className="m-2" src={eha} alt="" />
              <img className="m-2" src={safehire} alt="" />
              <img className="m-2" src={pricebeat} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const AddressListData = [
  {
    region: 'london',
    address: `Units A, B & C, Hanworth Trading
    Estate, A312 / Hampton Road West,
    Hanworth, Middx, TW13 6DH`,
  },
  {
    region: 'NORTH WEST',
    address: `Unit 7, Stakehill Industrial Estate
    Finlan Road, Manchester
    M24 2RW`,
  },
  {
    region: 'SOUTH WEST',
    address: `Unit 18, Hampton Park West
    Melksham, Wiltshire
    SN12 6LH`,
  },
  {
    region: 'MIDLANDS',
    address: `HQ & Showroom, Units 1 & 2 Maple
    Leaf Industrial Estate, Bloxwich
    Lane, Walsall, West Midlands WS2 8TF`,
  },
  {
    region: 'NORTH',
    address: `Unit 14, Enterprise Court, Prince Street,
    Bradford, West Yorkshire,
    BD4 6HQ`,
  },
];
