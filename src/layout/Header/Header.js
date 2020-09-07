import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Group,
  Menu,
  MenuButton,
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  useMenuState,
  usePopoverState,
} from 'reakit';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';
import { useList, useStore } from 'effector-react';

import { cartLenght$ } from 'features/cart';
import { categories$ } from 'features/products';
import { Search } from 'features/search';

import { Menu as MenuBox } from './Menu/Menu';
import { SelectLanguage } from './SelectLanguage/SelectLanguage';

import { Row, T8y } from 'ui';

import { ReactComponent as CartIcon } from 'assets/images/icon/basket.svg';
import { ReactComponent as CallIcon } from 'assets/images/icon/call.svg';
import { ReactComponent as Leaf } from 'assets/images/icon/leaf.svg';
import { ReactComponent as Logo } from 'assets/images/icon/Logo.svg';

import style from './header.module.scss';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    function toggleMenu(e) {
      if (e.target.classList.contains('disable-scrolling')) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.querySelector('body').classList.add('disable-scrolling');
      document.addEventListener('click', toggleMenu);
    } else {
      document.querySelector('body').classList.remove('disable-scrolling');
      document.removeEventListener('click', toggleMenu);
    }
  }, [isMenuOpen]);

  return (
    <>
      <header className={style.header}>
        <Link to={PATHS.ROOT} className={style.logo}>
          <Logo />
        </Link>
        <Search />
        <Group className={style.menu}>
          {useList(categories$, ({ slug, name }) => (
            <NavLink
              to={PATHS.CATEGORY(slug)}
              className={style.link}
              activeClassName={style.active}
            >
              {name}
            </NavLink>
          ))}
          <HeaderMenu />
        </Group>
        <Row align="center" noWrap className={style.basketAndLang}>
          <T8y asLink>
            <Call />
          </T8y>
          <Cart />
          <T8y asLink className="d-none d-lg-block">
            <SelectLanguage />
          </T8y>
          <Humburger
            open={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </Row>
        <div className={clsx(style.mobileMenu, isMenuOpen && style.open)}>
          <div className={style.mobileMenuTop}>
            <SelectLanguage />
          </div>
          <div className={style.mobileMenuList}>
            {useList(categories$, ({ slug, name }) => (
              <NavLink
                to={PATHS.CATEGORY(slug)}
                className={style.link}
                activeClassName={style.active}
              >
                {name}
              </NavLink>
            ))}
            <NavLink
              to={PATHS.ABOUT}
              className={style.link}
              activeClassName={style.active}
            >
              About us
            </NavLink>
            <a href={PATHS.BLOG} className={style.link}>
              Blog
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://help.easyeventhireuk.com/en/"
              className={style.item}
            >
              FAQ
            </a>
          </div>
        </div>
      </header>
      <div className={style.headerMessage}>
        <Leaf />
        easyEventhire is committed to sustainable events
      </div>
    </>
  );
}

function HeaderMenu(params) {
  const menu = useMenuState();
  return (
    <div className={style.dropdownWrap}>
      <MenuButton {...menu} className={clsx(style.link, style.disclosure)}>
        Company
      </MenuButton>
      <Menu {...menu} aria-label="Company" className={style.dropdown}>
        <MenuBox menu={menu} />
      </Menu>
    </div>
  );
}

function Cart({ className = '' }) {
  const cartLenght = useStore(cartLenght$);
  return (
    <Link to={PATHS.CART} className={clsx(style.basket, className)}>
      {!!cartLenght && <div className={style.circle}>{cartLenght}</div>}
      <CartIcon />
    </Link>
  );
}
function Call() {
  const popover = usePopoverState();

  return (
    <Row align="center">
      <PopoverDisclosure as={CallIcon} {...popover} />
      <Popover {...popover} className={style.phonePopover} aria-label="Phone">
        <PopoverArrow {...popover} className={style.phonePopoverArr} />
        <Row as={T8y} justify="center" variant="t3">
          Get a quote
        </Row>
        <Row justify="stretch" align="center">
          <CallIcon fill="#FF6600" width={14} className="mr-2" />
          <T8y variant="t2" as="a" href="tel:03308080361">
            0330 808 0361
          </T8y>
        </Row>
      </Popover>
    </Row>
  );
}

function Humburger({ open, ...otherProps }) {
  return (
    <div className={clsx(style.humburger, open && style.open)} {...otherProps}>
      <button type="button">
        <span />
        <span />
        <span />
      </button>
    </div>
  );
}
