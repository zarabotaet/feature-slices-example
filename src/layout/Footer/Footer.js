import React from 'react';
import { NavLink } from 'react-router-dom';
import { useList } from 'effector-react';

import { PATHS } from '../../AppPaths';
import { categories$ } from '../../features/products';
import { Policy, Terms } from './Text';

import { Row, T8y } from 'ui';
import { Modal } from 'ui/Modal/Modal';

import { ReactComponent as AmericanExpress } from 'assets/images/icon/AmericanExpress.svg';
import { ReactComponent as CallIcon } from 'assets/images/icon/call.svg';
import { ReactComponent as Facebook } from 'assets/images/icon/facebook.svg';
import { ReactComponent as Instagram } from 'assets/images/icon/instagram.svg';
import { ReactComponent as LinkedIn } from 'assets/images/icon/linkedin.svg';
import { ReactComponent as LocationIcon } from 'assets/images/icon/location-white.svg';
import { ReactComponent as Logo } from 'assets/images/icon/Logo.svg';
import { ReactComponent as MailIcon } from 'assets/images/icon/mail.svg';
import { ReactComponent as Mastercard } from 'assets/images/icon/Mastercard.svg';
import { ReactComponent as Visa } from 'assets/images/icon/Visa.svg';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const goUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section className="container-fluid footer-attachment">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-5 social-icons align-self-stretch-">
            <div className="d-flex align-items-center justify-content-center float-lg-right h-100 pr-md-5">
              <div className="d-flex justify-content-center flex-column">
                <Logo className="mb-5" />
                <div className="d-flex justify-content-center align-items-center mb-5">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.facebook.com/easyEventhire/"
                  >
                    <Facebook className="mx-3" />
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.instagram.com/easyeventhireuk/"
                  >
                    <Instagram className="mx-3" />
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.linkedin.com/company/easyeventhire/"
                  >
                    <LinkedIn className="mx-3" />
                  </a>
                </div>
                <Row noWrap align="center" className="mb-3">
                  <CallIcon className="mr-2" width={19} />
                  <T8y variant="t2" as="a" color="light" href="tel:03308080361">
                    0330 808 0361
                  </T8y>
                </Row>
                <Row noWrap align="center" className="mb-3">
                  <MailIcon className="mr-2" />
                  <T8y
                    variant="t2"
                    as="a"
                    color="light"
                    href="mailto:info@easyeventhireuk.com"
                  >
                    info@easyeventhireuk.com
                  </T8y>
                </Row>
                <Row noWrap align="center" className="mb-3">
                  <LocationIcon className="mr-2" />
                  <T8y variant="t2" as="address" color="light">
                    Floor 2, Argyle House, 29-31 Euston Rd, London NW1 2SD
                  </T8y>
                </Row>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7 text-center- text-lg-left">
            <div className="pl-0 pl-md-5">
              <dl className="d-flex justify-content-between justify-content-sm-center justify-content-lg-start nav-links pt-5 pb-4">
                <dt>
                  <NavLink to="/" onClick={() => goUp()}>
                    Instant quote
                  </NavLink>
                </dt>
                <dt>
                  <NavLink to={PATHS.ABOUT}>About us</NavLink>
                </dt>
                <dt>
                  <a href={PATHS.BLOG}>Blog</a>
                </dt>
                <dt>
                  <a href="https://help.easyeventhireuk.com/en/">FAQ</a>
                </dt>
              </dl>
              <div className="d-flex justify-content-between justify-content-sm-center justify-content-lg-start columns">
                {useList(categories$, ({ slug, name, childs }) => (
                  <dl className="nav-links text-capitalize" key={slug}>
                    <dt>
                      <NavLink
                        to={PATHS.CATEGORY(slug)}
                        activeClassName="active"
                      >
                        {name}
                        {name === 'Accessories' && ' Hire'}
                      </NavLink>
                    </dt>
                    {childs.map(subCategory => (
                      <dd key={subCategory.slug}>
                        <NavLink to={PATHS.CATEGORY(subCategory.slug)}>
                          {subCategory.name && subCategory.name.toLowerCase()}{' '}
                          Hire
                        </NavLink>
                      </dd>
                    ))}
                  </dl>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer py-3">
        <section className="container">
          <div className="row align-items-end align-items-xl-center">
            <div className="col-12 col-lg-3 col-xl-2 order-lg-last">
              <ul className="list-inline">
                <li className="list-inline-item py-2">
                  <Mastercard />
                </li>
                <li className="list-inline-item py-2">
                  <Visa />
                </li>
                <li className="list-inline-item py-2">
                  <AmericanExpress />
                </li>
              </ul>
            </div>

            <div className="col-12 col-lg-3 col-xl-5 py-2">
              <ul>
                <li>
                  <T8y color="light" asLink>
                    <Modal title="Terms & Conditions">
                      <Terms />
                    </Modal>
                  </T8y>
                </li>
                <li>
                  <T8y color="light" asLink>
                    <Modal title="Policy">
                      <Policy />
                    </Modal>
                  </T8y>
                </li>
                <li>
                  <a className="link" href="mailto:info@easyeventhireuk.com">
                    info@easyeventhireuk.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-12 col-lg-6 col-xl-5 order-lg-first py-2">
              Copyright &copy; {currentYear} easyEventhire. All prices are
              subject to VAT.
            </div>
          </div>
        </section>
      </footer>
    </>
  );
};
