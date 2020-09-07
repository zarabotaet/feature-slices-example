import React from 'react';
import { text } from 'seo/text';

import { T8y } from 'ui';

import { title } from './seoText.module.scss';

export function SeoText({ category }) {
  return (
    <div className="container">
      <div className="row flex-column flex-lg-row">
        <div className="col col-lg-3">
          <T8y as="h1" variant="h1" color="primary" className={title}>
            {text[category].sections[0].title}
          </T8y>
        </div>
        <div className="col col-lg-9">
          <T8y variant="t1">{text[category].sections[0].paragraphs[0]}</T8y>
        </div>
      </div>
    </div>
  );
}
