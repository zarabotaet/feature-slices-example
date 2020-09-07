import React from 'react';

import { Button, Row, T8y } from 'ui';

import style from './faq.module.scss';

export function FAQ() {
  return (
    <Row className={style.faq}>
      <T8y as="h2" variant="h1" color="primary">
        Delivery FAQ
      </T8y>
      <ul>
        {faqMock.map(({ q, a }) => (
          <li className={style.faqItem} key={q}>
            <T8y as="h4" bold className={style.faqTitle}>
              {q}
            </T8y>
            <T8y>{a}</T8y>
          </li>
        ))}
      </ul>
      <Button
        as="a"
        href="https://help.easyeventhireuk.com/en/"
        className={style.faqButton}
        inverse
      >
        Go to general FAQ
      </Button>
    </Row>
  );
}

const faqMock = [
  {
    q: 'Do you offer a transport service?',
    a: 'Yes, our fleet can deliver to most parts of the UK.',
  },
  {
    q: 'What areas do you cover?',
    a: 'Almost all! Check out our postcode finder for your area.',
  },
  {
    q: 'Am I able to collect in person?',
    a:
      'Yes you are able to collect items in person and not pay transport charges, though for bulkier items we’d certainly recommend you using our transport service, providing you with a seamless delivery and collection service.',
  },
];
