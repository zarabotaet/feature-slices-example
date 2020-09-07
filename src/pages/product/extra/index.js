import React from 'react';
import { Button as ButtonR } from 'reakit';

import { Button, Row, T8y } from 'ui';

import { ReactComponent as Basket } from 'assets/images/icon/buttonBasket.svg';
import { ReactComponent as Gear } from 'assets/images/icon/gear.svg';
import { ReactComponent as Checked } from 'assets/images/icon/subcategory--checked.svg';
import { ReactComponent as Warning } from 'assets/images/icon/warning.svg';

import style from './extra.module.scss';

export function Extra({
  type,
  productName = '',
  extras = [],
  onSkip,
  onChange,
  selected,
}) {
  return (
    <>
      <Row justify="stretch" noWrap className={style.header}>
        <T8y variant="h1">
          One more step:
          <T8y variant="h1" color="primary">
            {type === 'req' ? 'Required extra' : 'Optional extra'}
          </T8y>
        </T8y>
        {type === 'req' ? (
          <T8y as={Row} align="center" noWrap className={style.description}>
            <Warning />
            To order {productName} you need to select required extras from the
            list below. You will get 1 extra item for every {productName} hired.
            We are not providing {productName} separately.
          </T8y>
        ) : (
          <Button inverse onClick={onSkip}>
            Skip This Step
          </Button>
        )}
      </Row>
      <ExtraList extras={extras} onChange={onChange} selected={selected} />
    </>
  );
}
export function ExtraList({ extras = [], onChange, selected }) {
  return (
    <Row className={style.cardRows}>
      {extras.map(e => (
        <ExtraCard
          {...e}
          key={e.id}
          onClick={() => onChange(e)}
          selected={selected?.id === e?.id}
        />
      ))}
    </Row>
  );
}

export function ExtraCard({
  price,
  src,
  value,
  id,
  name,
  onClick,
  selected,
  sale = name === 'optional sale extra',
}) {
  return (
    <ButtonR
      as={Row}
      direction="column"
      align="stretch"
      className={style.card}
      onClick={onClick}
    >
      <Row
        as={Row}
        direction="column"
        justify="stretch"
        className={style.cardBody}
        style={{
          backgroundImage: `url(${src})`,
        }}
      >
        <Row justify="end" className={style.cardHeader}>
          <T8y variant="t1">
            £{parseFloat(price || 0).toFixed(2)}
            <T8y variant="t2">per week</T8y>
            {sale && (
              <T8y variant="t3" color="light" className={style.badge}>
                <Gear />
                Sale!
              </T8y>
            )}
          </T8y>
        </Row>
        <T8y color="light" className={style.cardFooter}>
          {value || 'No title'}
        </T8y>
      </Row>
      <Button
        className={style.cardSelect}
        dark={selected}
        prefixIcon={selected ? <Checked /> : <Basket />}
      >
        {selected ? 'Selected' : 'Select'}
      </Button>
    </ButtonR>
  );
}
