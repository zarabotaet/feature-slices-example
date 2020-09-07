import React from 'react';
import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  usePopoverState,
} from 'reakit';
import { changeSearchStr, serchStr$ } from 'admin/pages/model';
import { useStore } from 'effector-react';
import { styled } from 'linaria/react';
import { transparentize } from 'polished';

import { colors } from '../../styleGuide';
import { T8y } from 'admin/ui';
import { Icon } from 'admin/ui/Icon';
import { Cell, Grid, Row } from 'ui';

import { ReactComponent as Lens } from '../../assets/icons/lens.svg';
import { ReactComponent as Note } from '../../assets/icons/note.svg';
import { ReactComponent as Logo } from '../../assets/images/LogoAdmin.svg';

export function Header() {
  return (
    <Grid
      places="center stretch"
      cols="40fr 32rem 18rem auto"
      as={HeaderStyled}
    >
      <Cell as={Logo} place="center start" />
      <Search />
      <Notification />
      <AccountDetails />
    </Grid>
  );
}

const Notification = () => {
  const popover = usePopoverState();
  return (
    <>
      <Cell place="center">
        <PopoverDisclosure {...popover}>
          <Icon as={Note} />
        </PopoverDisclosure>
      </Cell>
      <Popover
        {...popover}
        as={PopoverStyled}
        aria-label="Notification"
        tabIndex={0}
      >
        <PopoverArrow {...popover} />
        <T8y color="negative">Noficattion!!!</T8y>
      </Popover>
    </>
  );
};

const AccountDetails = () => {
  const popover = usePopoverState();
  return (
    <>
      <Cell place="center end">
        <PopoverDisclosure {...popover}>
          <AvatarStyled as={T8y} color="primary" bold>
            SP
          </AvatarStyled>
        </PopoverDisclosure>
      </Cell>
      <Popover
        {...popover}
        as={PopoverStyled}
        aria-label="Notification"
        tabIndex={0}
      >
        <PopoverArrow {...popover} />
        <T8y color="negative">Here will be account details</T8y>
      </Popover>
    </>
  );
};

const Search = () => {
  const searchStr = useStore(serchStr$);

  return (
    <Row as={SearchStyled} align="center">
      <Icon as={Lens} />
      <T8y
        color="negative"
        as="input"
        placeholder="Search"
        name="search"
        value={searchStr}
        onChange={e => changeSearchStr(e.target.value)}
      />
    </Row>
  );
};

const SearchStyled = styled.label`
  padding: 0 2rem;
  color: ${colors.gray};
  border: 1px solid ${colors.gray};
  border-radius: 0.4rem;
  &:focus-within {
    border-color: ${colors.primary};
    svg {
      animation: pulsate-bck 0.7s ease-in-out infinite both;
    }
  }
  input {
    flex-grow: 1;
    height: 100%;
    padding: 1.5rem 1rem;
    outline: none;
  }
  @keyframes pulsate-bck {
    0% {
      transform: rotate(0deg) scale(1);
    }
    50% {
      transform: rotate(12deg) scale(0.9);
    }
    100% {
      transform: rotate(0deg) scale(1);
    }
  }
`;

const PopoverStyled = styled.div`
  padding: 2rem;
  background-color: ${colors.positive};
  border: 1px solid ${colors.primary};
  border-radius: 0.4rem;
  box-shadow: 0px 0.5rem 2.5rem ${transparentize(0.8, colors.gray)};
  path:first-of-type {
    fill: ${colors.primary};
  }
  path:last-of-type {
    fill: ${colors.positive};
  }
`;

const AvatarStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.2rem;
  height: 4.2rem;
  background-color: ${transparentize(0.9, colors.primary)};
  border-radius: 50%;
`;

const HeaderStyled = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 0 12rem;
  background-color: ${colors.positive};
  box-shadow: 0px 0.5rem 2.5rem ${transparentize(0.8, colors.gray)};
`;
