import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { Row } from 'ui';
import { T8y } from 'ui/Typography/Typography';

import { ReactComponent as PageIcon } from 'assets/images/icon/Page.svg';

import style from './pagination.module.scss';

export const Pagination = ({
  currentPage = 0,
  path = 'page',
  search = '',
  totalPages = 7,
}) => {
  const activeItem = Number(currentPage) - 1;

  const realPath = React.useMemo(() => {
    return `${path
      .split('/')
      .slice(0, -1)
      .join('/')}/`;
  }, [path]);

  if (totalPages === 1) {
    return false;
  }
  return (
    <Row className={style.pagination} justify="center" align="center">
      <T8y variant="t2" as={Row} align="center">
        Page
        <PageIcon className={style.icon} />
      </T8y>

      {Array.from({ length: totalPages }).map((_, i) => (
        <Row
          key={i}
          to={realPath + (i + 1) + search}
          as={Link}
          align="center"
          justify="center"
          className={clsx(style.item, { [style.active]: activeItem === i })}
        >
          <T8y variant="t1" as="span">
            {i + 1}
          </T8y>
        </Row>
      ))}
    </Row>
  );
};
