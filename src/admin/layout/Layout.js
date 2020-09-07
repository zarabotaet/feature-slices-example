import React from 'react';
import { toast } from 'react-toastify';
import { styled } from 'linaria/react';

import { Header } from './Header/Header';
import { Navbar } from './Navbar/Navbar';

import { colors, fonts } from '../styleGuide';
import { Cell, Grid } from 'ui';

import 'react-toastify/dist/ReactToastify.css';

toast.configure({
  autoClose: 3000,
  position: 'bottom-right',
  style: { font: fonts.bold, color: colors.positive },
  progressStyle: { background: colors.primary },
});

export const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Grid rows="7.8rem 1fr">
        <Header />
        <Cell as={MainStyled}>{children}</Cell>
      </Grid>
    </>
  );
};

const MainStyled = styled.div`
  padding: 3rem 12rem;
  background-color: ${colors.bg};
`;
