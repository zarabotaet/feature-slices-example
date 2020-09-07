import React from 'react';

import { PostcodeFieldFilter } from 'features/filter';

import { DatePickerInput, Row, T8y } from 'ui';

import style from './header.module.scss';

export function Header() {
  return (
    <Row align="center" justify="stretch" className={style.header}>
      <T8y as="h3" variant="h1" color="primary">
        Your quote
      </T8y>
      <Row>
        <PostcodeFieldFilter className="mr-5" />
        <DatePickerInput
          edge="start"
          legend="Hire start date"
          className="mr-5"
          style={{ minWidth: '15rem' }}
        />
        <DatePickerInput
          edge="end"
          legend="Hire end date"
          style={{ minWidth: '15rem' }}
        />
      </Row>
    </Row>
  );
}
