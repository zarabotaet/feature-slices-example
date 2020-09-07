import React from 'react';
import { Button } from 'reakit';
import { useStore } from 'effector-react';

import { changeSearchStr, searchStr$ } from 'features/filter';

import { Row } from 'ui';

import { ReactComponent as Lens } from 'assets/images/icon/lens.svg';

import style from './search.module.scss';

export function Search() {
  const searchStr = useStore(searchStr$);
  const [value, setValue] = React.useState(searchStr);

  const onSubmit = e => {
    e.preventDefault();
    changeSearchStr(value);
  };

  return (
    <Row as="form" onSubmit={onSubmit} align="center" className={style.search}>
      <Row as={Button} align="center" type="submit" className={style.searchBtn}>
        <Lens />
      </Row>
      <span className={style.searchText}>Search:</span>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="foldable chair"
        name="search"
      />
    </Row>
  );
}
