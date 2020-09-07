import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'reakit';
import { PATHS } from 'admin/AdminAppPaths';
import { styled } from 'linaria/react';

import { logout } from 'admin/api';

import { colors } from '../../styleGuide';
import { Icon, T8y } from 'admin/ui';
import { Cell, Grid } from 'ui';

import { ReactComponent as Humburger } from '../../assets/icons/humburger.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg';
import { ReactComponent as ManageIcon } from '../../assets/icons/manage.svg';
import { ReactComponent as OrdersIcon } from '../../assets/icons/orders.svg';
import { ReactComponent as ProductsIcon } from '../../assets/icons/products.svg';

export function Navbar() {
  return (
    <Grid
      rows="1fr repeat(3, 9.5rem) 2fr"
      places="stretch"
      gaps="2rem 0"
      as={NavbarStyled}
      area="nav"
    >
      <Cell place="start center">
        <Icon as={Humburger} light noHover />
      </Cell>

      <NavLinkCustom to="/admin/manage" icon={ManageIcon}>
        Manage
      </NavLinkCustom>
      <NavLinkCustom to="/admin/orders" icon={OrdersIcon}>
        Orders
      </NavLinkCustom>
      <NavLinkCustom to={PATHS.PRODUCTS} icon={ProductsIcon}>
        Products
      </NavLinkCustom>

      <Cell place="end stretch" as={LogoutStyled} onClick={logout}>
        <Icon as={LogoutIcon} light noHover />
        <T8y color="positive" bold>
          Log Out
        </T8y>
      </Cell>
    </Grid>
  );
}

function NavLinkCustom({ icon: Icon, to, children }) {
  return (
    <NavLinkCustomStyled as={NavLink} to={to} light>
      <Icon />
      <T8y color="positive" bold variant="t3">
        {children}
      </T8y>
    </NavLinkCustomStyled>
  );
}

const NavLinkCustomStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  &.active,
  &:hover {
    background-color: ${colors.positive};
    & > div {
      color: ${colors.primary};
    }
    svg {
      fill: ${colors.primary};
    }
  }
  svg {
    fill: ${colors.positive};
  }
`;

const NavbarStyled = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  width: 9.5rem;
  padding: 2rem 0;
  color: #fff;
  background-color: ${colors.primary};
`;

const LogoutStyled = styled(Button)`
  cursor: pointer;
`;
