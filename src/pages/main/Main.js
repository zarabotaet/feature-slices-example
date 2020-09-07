import React from 'react';
import { Meta } from 'seo';

import { PopularProducts } from 'features/products';

import { AfterHeader } from './AfterHeader/AfterHeader';
import { BeforeFooter } from './BeforeFooter/BeforeFooter';
import { BlockInfo } from './BlockInfo/BlockInfo';
import { Packages } from './Packages/Packages';
import { SeoText } from './SeoText/SeoText';
import { WorkWith } from './WorkWith/WorkWith';

import brand from 'assets/images/picture/brands/bbc.jpg';
import brand2 from 'assets/images/picture/brands/boots.png';
import brand3 from 'assets/images/picture/brands/harvey.jpg';
import brand4 from 'assets/images/picture/brands/jlr.png';
import brand5 from 'assets/images/picture/brands/malmaison.jpeg';
import brand6 from 'assets/images/picture/brands/royal.jpg';

export const Main = () => (
  <>
    <AfterHeader />
    <Meta category="main" />
    <SeoText category="main" />
    <PopularProducts />
    <WorkWith data={[brand, brand2, brand3, brand4, brand5, brand6]} />
    <Packages />
    <BlockInfo />
    <BeforeFooter />
  </>
);
