import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { ReactComponent as DE } from 'assets/images/icon/DE.svg';
import { ReactComponent as ES } from 'assets/images/icon/ES.svg';
import { ReactComponent as FR } from 'assets/images/icon/FR.svg';
import { ReactComponent as GB } from 'assets/images/icon/GB.svg';
import { ReactComponent as IT } from 'assets/images/icon/IT.svg';
import { ReactComponent as NE } from 'assets/images/icon/NE.svg';

import style from './selectLanguage.module.scss';

//Mock language data. Expecting with API
const languages = {
  NE: {
    name: 'NE',
    nativeName: 'Netherland',
  },
  IT: {
    name: 'IT',
    nativeName: 'Italy',
  },
  DE: {
    name: 'DE',
    nativeName: 'Native name here',
  },
  ES: {
    name: 'ES',
    nativeName: ' Native name here',
  },
  GB: {
    name: 'Great Britain',
    nativeName: 'Great Britain',
  },
};

//Expecting current language with API
const currentLanguage = 'GB';

//This is a helper function. It can be moved to another location.
const setLanguageFlag = flag => {
  switch (flag) {
    case 'GB':
      return <GB />;
    case 'FR':
      return <FR />;
    case 'ES':
      return <ES />;
    case 'DE':
      return <DE />;
    case 'NE':
      return <NE />;
    case 'IT':
      return <IT />;
    default:
      return;
  }
};

export const SelectLanguage = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const wrapperRef = useRef(null);

  const useOutsideAlerter = ref => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    });
  };

  useOutsideAlerter(wrapperRef);

  const handleChangeLanguage = flag => {
    //  This describes the behavior when changing the language
  };

  return (
    <div ref={wrapperRef}>
      <div
        className={clsx(style.language, openMenu ? style.borders : null)}
        onClick={() => setOpenMenu(!openMenu)}
      >
        {setLanguageFlag(currentLanguage)}
      </div>
      {openMenu && (
        <div className={clsx(style.country, openMenu ? style.open : null)}>
          {Object.entries(languages)
            .filter(entries => entries[0] !== currentLanguage)
            .map(entries => (
              <div
                key={entries[0]}
                className={clsx(style.flag)}
                title={entries[1].name}
                onClick={() => handleChangeLanguage(entries[0])}
              >
                {setLanguageFlag(entries[0])}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
