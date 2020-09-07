import React from 'react';
import { Helmet } from 'react-helmet';
import { text } from 'seo/text';

export const Meta = ({ category, product = {} }) => {
  const title = product?.title || text[category]?.title || '';
  const description =
    product?.description || text[category]?.sections[0]?.paragraphs[0] || '';

  return (
    <Helmet>
      <title>{filter(title, category) + conditionalHireWord(category)}</title>
      <meta name="description" content={cut(description)} />
    </Helmet>
  );
};

const filter = (title = '', category) =>
  !['main', 'about'].includes(category)
    ? format(title.replace(/HIRE/gi, ''))
    : title;

const format = (title = '') =>
  title.charAt(0).toUpperCase() + title.substring(1).toLowerCase();

const cut = (description = '') => description.substring(0, 160) + '...';

//TODO add categories
const conditionalHireWord = category =>
  !['main', 'about'].includes(category) || !category ? ' Hire' : '';
