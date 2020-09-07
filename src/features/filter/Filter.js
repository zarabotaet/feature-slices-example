import React from 'react';
import { Link } from 'react-router-dom';
import { RadioGroup, useRadioState } from 'reakit/Radio';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import {
  changeDeliveryMethod,
  changePostCodeInput,
  changeSize,
  deliveryMethod$,
  postcode$,
  postcodeError$,
  postcodePrice$,
  selectedDiscount$,
  size$,
} from 'features/cart';

import { filterSearchString$ } from './filterModel';

import {
  Button,
  DatePickerInput,
  Field,
  inputStyle,
  Radio,
  Row,
  Select,
  T8y,
} from 'ui';

import { ReactComponent as Location } from 'assets/images/icon/location.svg';
import { ReactComponent as Postcode } from 'assets/images/icon/Oktotorp.svg';
import { ReactComponent as Range } from 'assets/images/icon/Range.svg';

import style from './filter.module.scss';

export function Filter() {
  const selectedDiscount = useStore(selectedDiscount$);

  return (
    <div className={style.filter}>
      {selectedDiscount?.days && (
        <T8y className={style.p}>
          Book more than {selectedDiscount.days} days in advance.{' '}
          <T8y as="span" color="primary">
            Get a -{selectedDiscount.value}% discount.
          </T8y>
        </T8y>
      )}

      <Field
        legend="Event duration"
        noBorder
        className="mb-4"
        fieldClassName={style.grid}
      >
        <DatePickerInput edge="start" className={style.gridItem} />
        <DatePickerInput edge="end" className={style.gridItem} />
      </Field>

      <DeliverySelect />

      <PostcodePrice />

      <Row justify="stretch" className="mb-4">
        <Button
          inverse
          onClick={() => window.$crisp.push(['do', 'chat:open'])}
          className={style.button}
        >
          Ask Expert in Livechat
        </Button>
        <FilterLink className={style.button}>Show Products</FilterLink>
      </Row>

      <Row align="center" justify="center">
        <Location />
        <span
          className={style.locationTitle}
          onClick={() => {
            const element = document.getElementById('branch-locator');
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }}
        >
          Branch locator
        </span>
      </Row>
    </div>
  );
}

export const PostcodeFieldFilter = ({ className = '', ...rest }) => {
  const postcode = useStore(postcode$);
  const postcodeError = useStore(postcodeError$);
  const ref = React.useRef();
  const { method } = useStore(deliveryMethod$);
  const isSelf = method === 'self';

  React.useEffect(() => {
    if (postcodeError && ref.current) {
      ref.current.focus();
    }
  }, [postcodeError]);

  if (isSelf) return null;

  return (
    <Row className={className} noWrap align="start">
      <Field
        icon={Postcode}
        legend="Delivery location"
        style={{ flexGrow: 1 }}
        error={postcodeError}
      >
        <input
          placeholder="Postcode"
          className={inputStyle}
          value={postcode}
          onChange={changePostCodeInput}
          ref={ref}
        />
      </Field>
    </Row>
  );
};

export const PostcodePrice = () => {
  const postcodePrice = useStore(postcodePrice$);
  const { method } = useStore(deliveryMethod$);
  const isSelf = method === 'self';

  return (
    <Row justify="stretch" className={clsx(style.delivery, 'mb-4')}>
      <T8y bold>Delivery & Collection price</T8y>
      {isSelf ? <T8y bold>Free</T8y> : <T8y bold>{postcodePrice || '-'}</T8y>}
    </Row>
  );
};

export const DeliverySelect = React.memo(({ sidebar, className = '' }) => {
  const { method } = useStore(deliveryMethod$);

  const radio = useRadioState({ state: method });

  React.useEffect(() => {
    changeDeliveryMethod(radio.state);
  }, [radio.state]);

  return (
    <RadioGroup {...radio} aria-label="delivery-select" className={className}>
      <Row
        justify={sidebar ? 'start' : 'stretch'}
        align={sidebar ? 'stretch' : 'center'}
        className="mb-4"
        direction={sidebar ? 'column' : 'row'}
      >
        <Radio
          {...radio}
          text="Delivery & Collection"
          value="delivery"
          className={clsx({ [style.gridItem]: !sidebar, 'mb-2': sidebar })}
        />
        <PostcodeFieldFilter className={clsx({ [style.gridItem]: !sidebar })} />
      </Row>
      <Row
        align={sidebar ? 'stretch' : 'center'}
        justify={sidebar ? 'start' : 'stretch'}
        className="mb-4"
        direction={sidebar ? 'column' : 'row'}
      >
        <Radio
          {...radio}
          text={
            <>
              Self-Collection <Free />
            </>
          }
          value="self"
          className={clsx({ [style.gridItem]: !sidebar })}
        />
      </Row>
    </RadioGroup>
  );
});

const Free = () => (
  <T8y variant="t3" color="primary" className={style.freeLabel}>
    Free
  </T8y>
);

export const SizeSelect = ({ className, ...rest }) => {
  const size = useStore(size$);

  return (
    <Field legend="Event size" icon={Range} className={className} {...rest}>
      <Select
        options={[
          { name: '1 - 50', slug: '1 - 50' },
          { name: '51 - 100', slug: '51 - 100' },
          { name: '100+', slug: '100+' },
        ]}
        defaultText="Select size"
        selected={size}
        aLabel="event size"
        onClickOption={changeSize}
        className={inputStyle}
      />
    </Field>
  );
};

const FilterLink = ({ children, className }) => {
  const params = useStore(filterSearchString$);
  return (
    <Button as={Link} to={`${PATHS.PRODUCTS}?${params}`} className={className}>
      {children}
    </Button>
  );
};

export const PostcodeField = ({ className, ...rest }) => {
  const postcode = useStore(postcode$);
  const postcodePrice = useStore(postcodePrice$);

  return (
    <Field
      legend={
        postcodePrice
          ? `Transport location price: ${postcodePrice}`
          : 'Postcode'
      }
      icon={Postcode}
      className={className}
      {...rest}
    >
      <input
        placeholder="Postcode"
        className={inputStyle}
        value={postcode}
        required
        pattern="^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$"
        onChange={changePostCodeInput}
      />
    </Field>
  );
};
