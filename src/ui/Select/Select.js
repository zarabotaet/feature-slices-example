import React from 'react';
import { Menu, MenuButton, MenuItem, useMenuState } from 'reakit';
import clsx from 'clsx';

import style from './select.module.scss';

export function Select({
  // array with name and slug
  options = [],
  value,
  aLabel,
  selected = options[0],
  defaultText,
  onClickOption,
  className,
  ...rest
}) {
  const menu = useMenuState();
  return (
    <>
      <MenuButton {...menu} className={clsx(className, style.menu)}>
        {selected || defaultText}
      </MenuButton>
      <Menu {...menu} aria-label={aLabel} className={style.options}>
        {options.map(({ name, slug }, i) => (
          <MenuItem
            {...menu}
            key={i}
            onClick={() => {
              onClickOption(slug);
              menu.hide();
            }}
            className={style.option}
          >
            {name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
