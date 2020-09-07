import React from 'react';
import { text } from 'seo/text';

import { T8y } from 'ui';

import style from './products.module.scss';

export function SeoText({ category }) {
  if (!text[category]) return null;
  return (
    <div className={style.seoText}>
      <T8y as="h1" variant="h1">
        {text[category].title}
      </T8y>
      {text[category].sections.map(({ title, paragraphs }) => (
        <>
          {Boolean(title) && (
            <T8y as="h2" variant="h2" className="mt-4">
              {title}
            </T8y>
          )}
          {paragraphs.length &&
            paragraphs.map(t => (
              <T8y variant="t2" className="mb-3">
                {t}
              </T8y>
            ))}
        </>
      ))}
    </div>
  );
}
