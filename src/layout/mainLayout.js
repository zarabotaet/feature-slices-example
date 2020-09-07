import React from 'react';
import CookieBanner from 'react-cookie-banner';
import { useLocation } from 'react-router-dom';
import { PATHS } from 'AppPaths';

import { Footer } from './Footer/Footer';
import { Header } from './Header/Header';

import style from './mainLayout.module.scss';

const footerBlokedUrls = [PATHS.LOGIN];
const headerAllContentUrls = [PATHS.LOGIN];

function useCheckLocation() {
  const { pathname } = useLocation();
  return {
    isFooter: !footerBlokedUrls.some(e => e === pathname),
    headerAllContent: !headerAllContentUrls.some(e => e === pathname),
  };
}

export const MainLayout = ({ children }) => {
  const { isFooter, headerAllContent } = useCheckLocation();

  return (
    <div className={style.page}>
      <CookieBanner
        styles={{
          banner: { backgroundColor: 'rgba(255, 102, 0, 1)' },
        }}
        message="By using this site you agree to the use of cookies"
        onAccept={() => {}}
        cookie="user-has-accepted-cookies"
      />
      <Header contentFull={headerAllContent} />
      <main className={style.main}>{children}</main>
      {isFooter && <Footer />}
    </div>
  );
};
