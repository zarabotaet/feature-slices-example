import React from 'react';
import { Link } from 'react-router-dom';

import { Button, ProductCard, Row } from 'ui';

import style from './cardsGrid.module.scss';

export function CardsGrid({
  cardsLength = 4,
  cards = Array(cardsLength),
  showMoreLink,
  loading,
}) {
  return (
    <div className="row">
      {cards.map((card, id) => (
        <div className="col-6 col-lg-3 p-3" key={id}>
          <ProductCard {...card} loading={loading} />
        </div>
      ))}
      <div className="col-6 col-lg-3 p-3">
        {showMoreLink && !!cards.length && (
          <Link to={showMoreLink}>
            <Row className={style.showMore} align="center" justify="center">
              <Button>Show More</Button>
            </Row>
          </Link>
        )}
      </div>
    </div>
  );
}
