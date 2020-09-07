import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from 'reakit';
import { PATHS } from 'AppPaths';

import style from './menu.module.scss';

export const Menu = ({ menu }) => (
  <div className={style.menu}>
    <MenuItem {...menu} as={Link} to={PATHS.ABOUT} className={style.item}>
      About us
    </MenuItem>
    <MenuItem {...menu} as="a" href={PATHS.BLOG} className={style.item}>
      Blog
    </MenuItem>
    <MenuItem
      {...menu}
      as="a"
      href="https://help.easyeventhireuk.com/en/"
      className={style.item}
    >
      FAQ
    </MenuItem>
  </div>
);
