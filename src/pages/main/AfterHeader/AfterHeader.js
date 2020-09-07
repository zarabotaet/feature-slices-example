import React from 'react';

import { Filter } from 'features/filter';

import { T8y } from 'ui';

import videoposter from '../../../assets/images/picture/afterHeader.jpg';
import video from '../../../assets/retuu.mp4';

import style from './afterHeader.module.scss';

export function AfterHeader() {
  return (
    <div className={style.afterHeader}>
      <video poster={videoposter} autoPlay muted loop className={style.videoBg}>
        <source src={video} type="video/mp4" />
      </video>
      <div className="container-fluid container-xl">
        <div className="row">
          <div className="col-12 col-md-5">
            <T8y variant="h1" className="py-5 d-md-none">
              Easy and budget friendly furniture, catering, and accessory hire
              UK wide.
            </T8y>
          </div>
          <div className="col-12 col-md-7">
            <Filter />
          </div>
        </div>
      </div>
    </div>
  );
}
