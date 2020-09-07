import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import useScript from 'react-script-hook';
import {
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  injectStripe,
  StripeProvider,
} from 'react-stripe-elements';
import { PATHS } from 'AppPaths';
import { format, formatISO, isWeekend, lightFormat, parseISO } from 'date-fns';
import { useStore } from 'effector-react';
import { CartInner, TotalPrice } from 'pages/cart/Cart';
import { DeliveryMethod } from 'pages/cart/DeliveryMethod/DeliveryMethod';
import { selectedWarehous$ } from 'pages/cart/DeliveryMethod/warehousesModel';
import {
  collectionSlot$,
  deliverySlot$,
  resetSlots,
} from 'pages/delivery/model';

import {
  cart$,
  cartLenght$,
  deliveryMethod$,
  picker_state$,
  postcode$,
  resetCart,
  selectedDiscount$,
  size$,
} from 'features/cart';
import { PostcodeField, SizeSelect } from 'features/filter';

import { history } from 'libs/history';
import { CHECKOUT } from 'api';

import { Terms } from '../../layout/Footer/Text';

import {
  Button,
  Center,
  Checkbox,
  Container,
  DatePickerInput,
  Field,
  inputStyle,
  Row,
  Spinner,
  T8y,
} from 'ui';
import { Modal } from 'ui/Modal/Modal';

import { ReactComponent as IconCity } from 'assets/images/icon/city.svg';
import dottedArrow from 'assets/images/icon/dotted-arrow.png';
import { ReactComponent as IconAddress } from 'assets/images/icon/icons8-address.svg';
import { ReactComponent as IconGeography } from 'assets/images/icon/icons8-geography.svg';
import { ReactComponent as IconInfo } from 'assets/images/icon/icons8-information.svg';
import { ReactComponent as IconName } from 'assets/images/icon/icons8-name.svg';
import { ReactComponent as IconPencil } from 'assets/images/icon/icons8-pencil_drawing.svg';
import { ReactComponent as IconPhone } from 'assets/images/icon/icons8-phone.svg';
import { ReactComponent as IconMail } from 'assets/images/icon/icons8-secured_letter.svg';
import { ReactComponent as IconTime } from 'assets/images/icon/icons8-timer.svg';
import ssl from 'assets/images/icon/ssl.svg';
import { ReactComponent as IconUser } from 'assets/images/icon/user-icon.svg';

import './stripe.scss';
import style from './checkout.module.scss';

export function Checkout({ location }) {
  const { search } = location;
  const cartLenght = useStore(cartLenght$);
  const { method } = useStore(deliveryMethod$);
  const isSelf = method === 'self';
  const [loading] = useScript({
    src: 'https://js.stripe.com/v3/',
  });

  return (
    <Container>
      {!!cartLenght && <Header />}
      <CartInner />
      <DeliveryMethod />
      {loading ? (
        <Center>
          <Spinner dark size={2} />
        </Center>
      ) : (
        !!cartLenght && (
          <StripeProvider apiKey={process.env.REACT_APP_STRIPE_API_KEY}>
            <Elements>
              {isSelf ? (
                <CheckoutFormIsSelfCollection
                  isLater={search.includes('later')}
                />
              ) : (
                <CheckoutForm isLater={search.includes('later')} />
              )}
            </Elements>
          </StripeProvider>
        )
      )}
    </Container>
  );
}

function CheckoutForm({ isLater, stripe }) {
  const { endDate, startDate } = useStore(picker_state$);
  const [isLift, setIsLift] = useState(true);
  const size = useStore(size$);
  const postcode = useStore(postcode$);
  const cart = useStore(cart$);
  const deliverySlot = useStore(deliverySlot$);
  const collectionSlot = useStore(collectionSlot$);
  const { search } = useLocation();

  const { register, handleSubmit, watch } = useForm();

  const { event_description, address_1, city, name, phone, email } = watch([
    'event_description',
    'address_1',
    'city',
    'name',
    'phone',
    'email',
  ]);

  const isSecondStep = Boolean(event_description && endDate && startDate);
  const isThirdStep = Boolean(
    address_1 && city && name && phone && email && postcode,
  );

  const [submiting, setSubmiting] = useState(false);
  const [checkoutData, setcheckoutData] = useState(null);

  const [startSlot, setstartSlot] = useState(null);
  const [endSlot, setendSlot] = useState(null);

  React.useEffect(() => {
    CHECKOUT.getDeliverySlots(startDate).then(({ data: { data } }) => {
      const dayStr = formatISO(startDate, { representation: 'date' });
      setstartSlot(
        data?.delivery_multihours_prices[dayStr].find(({ price }) =>
          isWeekend(startDate) ? Boolean(price) : price === 0,
        ),
      );
    });
  }, [startDate]);

  React.useEffect(() => {
    CHECKOUT.getDeliverySlots(endDate).then(({ data: { data } }) => {
      const dayStr = formatISO(endDate, { representation: 'date' });
      setendSlot(
        data?.delivery_multihours_prices[dayStr].find(({ price }) =>
          isWeekend(endDate) ? Boolean(price) : price === 0,
        ),
      );
    });
  }, [endDate]);

  const onSubmit = async data => {
    try {
      setSubmiting(true);
      const {
        city,
        event_description,
        address_1,
        address_2,
        collection_of_goods,
        site_name,
        site_number,
        floor,
        lift_weight_restriction,
        lift_dimensions,
        parking_restriction,
        vehicle_height_restriction,
        instruction,
        email,
        name,
        phone,
      } = data;
      const { data: checkoutData } = await CHECKOUT.go({
        hire_start_date: lightFormat(startDate, 'yyyy-MM-dd'),
        hire_end_date: lightFormat(endDate, 'yyyy-MM-dd'),
        event_size: size,
        postcode,
        delivery_price_id: deliverySlot?.id || startSlot?.id,
        collection_price_id: collectionSlot?.id || endSlot?.id,
        city,
        event_description,
        address_1,
        ...(address_2 && { address_2 }),
        ...(collection_of_goods && { collection_of_goods }),
        ...(floor && { floor }),
        ...(isLift && { has_lift: isLift }),
        ...(lift_weight_restriction && { lift_weight_restriction }),
        ...(lift_dimensions && { lift_dimensions }),
        ...(parking_restriction && { parking_restriction }),
        ...(vehicle_height_restriction && { vehicle_height_restriction }),
        ...(instruction && { instruction }),
        user: {
          email,
          name,
          phone,
          ...(site_name && { site_name }),
          ...(site_number && { site_number }),
        },
        products: cart.map(
          ({
            id,
            count: quantity,
            reqExtra,
            optionalExtra,
            optionalSaleExtra,
            returnDirty,
          }) => ({
            id: Number(id),
            quantity: Number(quantity),
            attributes: [reqExtra?.id, optionalExtra?.id, optionalSaleExtra?.id]
              .filter(Boolean)
              .map(e => ({ id: e, quantity })),
            is_return_dirty: Boolean(returnDirty),
          }),
        ),
      });
      setcheckoutData(checkoutData);
    } catch (e) {
      console.warn(e);
      setSubmiting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="checkout">
      <Row align="center" justify="stretch" className={style.header}>
        <T8y as="h3" variant="h1" color="primary">
          Checkout
        </T8y>
      </Row>
      <div className={style.checkoutWrapper}>
        <div className={style.fieldsWrapper}>
          <DatePickerInput
            edge="start"
            legend="Hire start date"
            className={style.field}
            req
            disabled
          />
          <DatePickerInput
            edge="end"
            legend="Hire end date"
            className={style.field}
            req
            disabled
          />
          <SizeSelect className={style.field} req />
        </div>
        <div className={style.fieldsWrapper}>
          <Field
            legend="Short description of the event"
            icon={IconInfo}
            textarea
            className={style.field}
            req
          >
            <textarea
              name="event_description"
              ref={register}
              required
              className={inputStyle}
              placeholder="Any information that might be useful"
            />
          </Field>
          <Field
            legend="Delivery & Pick up time"
            icon={IconTime}
            disabled
            className={style.field}
            req
          >
            <Row noWrap align="center" className={inputStyle}>
              <Link
                to={PATHS.DELIVERY_TIME_SELECT('delivery') + search}
                className={style.slotsInput}
              >
                {deliverySlot?.id
                  ? slotToString(deliverySlot)
                  : slotToString(startSlot)}
                /
              </Link>
              <Link
                to={PATHS.DELIVERY_TIME_SELECT('collection') + search}
                className={style.slotsInput}
              >
                {collectionSlot?.id
                  ? slotToString(collectionSlot)
                  : slotToString(endSlot)}
              </Link>
            </Row>
          </Field>
        </div>
      </div>
      {isSecondStep && (
        <div className={style.checkoutWrapper}>
          <Field
            legend="Address line 1"
            icon={IconAddress}
            className={style.field}
            req
          >
            <input
              name="address_1"
              ref={register}
              required
              type="text"
              placeholder="Address"
              className={inputStyle}
            />
          </Field>
          <Field
            legend="Address line 2"
            icon={IconAddress}
            className={style.field}
          >
            <input
              name="address_2"
              ref={register}
              type="text"
              placeholder="Address"
              className={inputStyle}
            />
          </Field>
          <div className={style.fieldsWrapper}>
            <Field legend="City" icon={IconCity} className={style.field} req>
              <input
                name="city"
                ref={register}
                required
                className={inputStyle}
                type="text"
                placeholder="Of delivery"
              />
            </Field>
            <PostcodeField className={style.field} req />
            <Field
              legend="Country"
              icon={IconGeography}
              disabled
              className={style.field}
            >
              <input
                name="country"
                value="United Kingdom"
                disabled
                ref={register}
                type="text"
                placeholder="United Kingdom"
                className={inputStyle}
              />
            </Field>
            <Field
              legend="Full name"
              icon={IconName}
              className={style.field}
              req
            >
              <input
                name="name"
                ref={register}
                required
                type="text"
                placeholder="Full name"
                className={inputStyle}
              />
            </Field>
            <Field
              legend="Phone number"
              icon={IconPhone}
              className={style.field}
              req
            >
              <input
                name="phone"
                ref={register}
                required
                className={inputStyle}
                type="text"
                placeholder="Phone number"
              />
            </Field>
            <Field legend="E-mail" icon={IconMail} className={style.field} req>
              <input
                name="email"
                ref={register}
                required
                className={inputStyle}
                type="email"
                placeholder="E-mail"
              />
            </Field>
          </div>
        </div>
      )}
      {isThirdStep && (
        <>
          <div className={style.checkoutWrapper}>
            <div className={style.fieldsWrapper}>
              <Field
                legend="Site contact name"
                icon={IconUser}
                className={style.field}
              >
                <input
                  name="site_name"
                  ref={register}
                  className={inputStyle}
                  type="text"
                  placeholder="John Smith"
                />
              </Field>
              <Field
                legend="Site contact number"
                icon={IconPhone}
                className={style.field}
              >
                <input
                  name="site_number"
                  ref={register}
                  className={inputStyle}
                  type="text"
                  placeholder="Please enter"
                />
              </Field>
            </div>
          </div>
          <div className={style.checkoutWrapper}>
            <div className={style.fieldsWrapper}>
              <Field
                legend="Collection of goods in one area or in multiple"
                icon={IconPencil}
                className={style.field}
              >
                <input
                  name="collection_of_goods"
                  ref={register}
                  className={inputStyle}
                  type="text"
                  placeholder="Please specify"
                />
              </Field>
              <Field legend="Floor" icon={IconPencil} className={style.field}>
                <input
                  name="floor"
                  ref={register}
                  className={inputStyle}
                  type="text"
                  placeholder="For crucial cases"
                />
              </Field>
              <Field legend="Is there a lift?" className={style.field}>
                <div
                  style={{
                    paddingLeft: '10px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Checkbox
                    label="Yes"
                    checked={isLift}
                    onChange={e => {
                      e.preventDefault();
                      setIsLift(!isLift);
                    }}
                  />
                </div>
              </Field>
            </div>
            {isLift && (
              <div className={style.fieldsWrapper}>
                <Field
                  legend="Lift weight restriction"
                  icon={IconPencil}
                  className={style.field}
                >
                  <input
                    name="lift_weight_restriction"
                    ref={register}
                    className={inputStyle}
                    type="text"
                    placeholder="Please specify"
                  />
                </Field>
                <Field
                  legend="Lift dimensions"
                  icon={IconPencil}
                  className={style.field}
                >
                  <input
                    name="lift_dimensions"
                    ref={register}
                    className={inputStyle}
                    type="text"
                    placeholder="Please specify"
                  />
                </Field>
              </div>
            )}
            <div className={style.fieldsWrapper}>
              <Field
                legend="Parking restriction"
                icon={IconPencil}
                className={style.field}
              >
                <input
                  name="parking_restriction"
                  ref={register}
                  className={inputStyle}
                  type="text"
                  placeholder="Please specify"
                />
              </Field>
              <Field
                legend="Vehicle height restrictions?"
                icon={IconPencil}
                className={style.field}
              >
                <input
                  name="vehicle_height_restriction"
                  ref={register}
                  className={inputStyle}
                  type="text"
                  placeholder="Archway, tunnel, etc."
                />
              </Field>
            </div>
            <Field
              legend="Special delivery instructions?"
              icon={IconPencil}
              className={style.field}
            >
              <input
                name="instruction"
                ref={register}
                className={inputStyle}
                type="text"
                placeholder="Please specify"
              />
            </Field>
          </div>
        </>
      )}
      <div className={style.bottom}>
        <Row justify="end" className={style.bottomWrapper}>
          <Row className={style.bottomInner}>
            <TotalPrice isLater={isLater} />
            <div className={style.dottedArrow}>
              <img src={dottedArrow} alt="" />
            </div>
            <Payment
              isLater={isLater}
              checkoutData={checkoutData}
              submiting={submiting}
              setSubmiting={setSubmiting}
            />
          </Row>
        </Row>
      </div>
    </form>
  );
}

function CheckoutFormIsSelfCollection({ isLater, stripe }) {
  const { endDate, startDate } = useStore(picker_state$);
  const size = useStore(size$);
  const { id: warehouse_id } = useStore(selectedWarehous$);

  const cart = useStore(cart$);

  const { register, handleSubmit } = useForm();

  const [submiting, setSubmiting] = useState(false);
  const [checkoutData, setcheckoutData] = useState(null);

  const onSubmit = async data => {
    try {
      setSubmiting(true);
      const { event_description, email, name, phone } = data;
      const { data: checkoutData } = await CHECKOUT.go({
        hire_start_date: lightFormat(startDate, 'yyyy-MM-dd'),
        hire_end_date: lightFormat(endDate, 'yyyy-MM-dd'),
        event_size: size,
        event_description,
        warehouse_id,
        user: {
          email,
          name,
          phone,
        },
        products: cart.map(
          ({
            id,
            count: quantity,
            reqExtra,
            optionalExtra,
            optionalSaleExtra,
            returnDirty,
          }) => ({
            id: Number(id),
            quantity: Number(quantity),
            attributes: [reqExtra?.id, optionalExtra?.id, optionalSaleExtra?.id]
              .filter(Boolean)
              .map(e => ({ id: e, quantity })),
            is_return_dirty: Boolean(returnDirty),
          }),
        ),
      });
      setcheckoutData(checkoutData);
    } catch (e) {
      console.warn(e);
      setSubmiting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="checkout">
      <div className={style.header}>
        <T8y as="h3" variant="h1" color="primary">
          Checkout
        </T8y>
      </div>
      <div className={style.checkoutWrapper}>
        <div className={style.fieldsWrapper}>
          <DatePickerInput
            edge="start"
            legend="Hire start date"
            className={style.field}
            req
            disabled
          />
          <DatePickerInput
            edge="end"
            legend="Hire end date"
            className={style.field}
            req
            disabled
          />
          <SizeSelect className={style.field} req />
        </div>
        <div className={style.fieldsWrapper}>
          <Field
            legend="Short description of the event"
            icon={IconInfo}
            textarea
            className={style.field}
            req
          >
            <textarea
              name="event_description"
              ref={register}
              required
              className={inputStyle}
              placeholder="Any information that might be useful"
            />
          </Field>
        </div>
      </div>
      <div className={style.checkoutWrapper}>
        <div className={style.fieldsWrapper}>
          <Field
            legend="Name of the person placing the order"
            icon={IconName}
            className={style.field}
            req
          >
            <input
              name="name"
              ref={register}
              required
              type="text"
              placeholder="John Smith"
              className={inputStyle}
            />
          </Field>
          <Field
            legend="Phone number"
            icon={IconPhone}
            className={style.field}
            req
          >
            <input
              name="phone"
              ref={register}
              required
              className={inputStyle}
              type="text"
              placeholder="For crucial cases"
            />
          </Field>
          <Field
            legend="E-mail address"
            icon={IconMail}
            className={style.field}
            req
          >
            <input
              name="email"
              ref={register}
              required
              className={inputStyle}
              type="email"
              placeholder="To keep you informed"
            />
          </Field>
        </div>
      </div>
      <div className={style.bottom}>
        <Row justify="end" className={style.bottomWrapper}>
          <Row className={style.bottomInner}>
            <TotalPrice isLater={isLater} />
            <div className={style.dottedArrow}>
              <img src={dottedArrow} alt="" />
            </div>
            {warehouse_id ? (
              <Payment
                isLater={isLater}
                checkoutData={checkoutData}
                submiting={submiting}
                setSubmiting={setSubmiting}
              />
            ) : (
              <T8y variant="t1" color="primary">
                Please select depot for self collection
              </T8y>
            )}
          </Row>
        </Row>
      </div>
    </form>
  );
}

const Payment = injectStripe(PaymentRow);

function PaymentRow({
  isLater,
  checkoutData,
  setSubmiting,
  submiting,
  stripe,
}) {
  const [policy, setPolicy] = useState(true);
  const [paynow, setpaynow] = useState(false);
  const [invalidCard, setinavalidCard] = useState(false);
  const selectedDiscount = useStore(selectedDiscount$);
  const [validate, setValidate] = useState({
    init: false,
    cardNumber: {
      complete: false,
      error: () => 'Card number is a required field',
    },
    cardExpiry: {
      complete: false,
      error: () => 'Expiration is a required field',
    },
    cardCvc: {
      complete: false,
      error: () => 'CVV is a required field',
    },
  });
  React.useEffect(() => {
    if (checkoutData) {
      (async () => {
        if (paynow) {
          try {
            const {
              data: { client_secret },
            } = await CHECKOUT.generate(checkoutData?.data?.user?.id);
            const { setupIntent } = await stripe.handleCardSetup(client_secret);
            await CHECKOUT.pay({
              user_id: checkoutData?.data?.user?.id,
              order_id: checkoutData?.data?.order_id,
              payment_method: setupIntent?.payment_method,
            });
            setpaynow(false);
            setinavalidCard(false);
            setSubmiting(false);
            resetRedirect();
          } catch (e) {
            console.warn(e);
            setinavalidCard(true);
            setSubmiting(false);
          }
        }
      })();
      if (!paynow) {
        setSubmiting(false);
        resetRedirect();
      }
    }
  }, [checkoutData, stripe, paynow, setSubmiting, isLater]);

  const handleInputChange = event => {
    setValidate(state => ({
      ...state,
      [event.elementType]: {
        complete: event.complete,
        error: () => {
          if (event.error) return event.error.message;
          if (event.empty) return requiredMessage[event.elementType];
          return null;
        },
      },
    }));
  };

  const handleSubmit = async () => {
    if (
      validate.cardNumber.complete &&
      validate.cardExpiry.complete &&
      validate.cardCvc.complete
    ) {
      setpaynow(true);
      // sumbmiting trik for react onSubmit
      const form = document.getElementById('checkout');
      if (form.reportValidity()) {
        form.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    } else {
      setValidate(state => ({ ...state, init: true }));
    }
  };

  return (
    <>
      <div className={style.paymentBlock}>
        <div className={style.paymentWrapper}>
          <div className={style.paymentTop}>
            <T8y as="h2" variant="h2">
              PAY BY CARD
            </T8y>
            <div className={style.paymentLabel}>
              <img src={ssl} alt="" />
              <span>Payment secured with SSL certificate</span>
            </div>
          </div>
          <div className={style.paymentField}>
            <CardNumberElement
              {...createOptions()}
              onChange={handleInputChange}
            />
            {validate.init && validate.cardNumber.error() && (
              <div className={style.error}>{validate.cardNumber.error()}</div>
            )}
          </div>
          <div className={style.formWrapper}>
            <div
              className={style.paymentField}
              style={{ flex: '0 0 155px', marginRight: 'auto' }}
            >
              <CardExpiryElement
                {...createOptions()}
                onChange={handleInputChange}
              />
              {validate.init && validate.cardExpiry.error() && (
                <div className={style.error}>{validate.cardExpiry.error()}</div>
              )}
            </div>
            <div className={style.paymentField} style={{ marginLeft: '20px' }}>
              <CardCVCElement
                {...createOptions()}
                onChange={handleInputChange}
              />
              {validate.init && validate.cardCvc.error() && (
                <div className={style.error}>{validate.cardCvc.error()}</div>
              )}
            </div>
          </div>
        </div>
        {invalidCard && (
          <T8y variant="h2" color="danger" className="mt-2 text-center">
            Invalid card number
          </T8y>
        )}
        <div className={style.paymentPolicy}>
          <Checkbox
            policy
            checked={policy}
            onChange={() => setPolicy(!policy)}
            label={
              <>
                <>I have read and agreed to the terms outlined in the order. </>
                <strong
                  onClick={() => {
                    setPolicy(policy);
                  }}
                >
                  <Modal title="Terms & Conditions" strong asLink>
                    <Terms />
                  </Modal>
                </strong>
              </>
            }
          />
        </div>
        <div className={style.actions}>
          <Button
            disabled={!policy}
            onClick={handleSubmit}
            loading={paynow && submiting}
            postfix={selectedDiscount?.value && `-${selectedDiscount?.value}%`}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </>
  );
}

function Header() {
  return (
    <Row align="center" justify="stretch" className={style.header}>
      <T8y as="h3" variant="h1" color="primary">
        Approve Quote
      </T8y>
    </Row>
  );
}

function resetRedirect() {
  resetCart();
  resetSlots();
  history.replace(PATHS.SUCCESS);
}

function slotToString(slot) {
  const { start_date, end_date } = slot || {};
  if (start_date && end_date) {
    const startHour = format(parseISO(start_date), 'HH:mm');
    const endHour = format(parseISO(end_date), 'HH:mm');
    return `${startHour}-${endHour} (+£${slot?.price})`;
  }

  return '00:00-00:00 (+£$0)';
}

function createOptions() {
  return {
    style: {
      base: {
        fontSize: '16px',
        lineHeight: '54px',
        color: '#424770',
        '::placeholder': {
          color: '#ccc',
        },
      },
      invalid: {
        color: '#424770',
      },
    },
    classes: {
      base: 'stripe-input-base',
      complete: 'stripe-input-complete',
      empty: 'stripe-input-empty',
      focus: 'stripe-input-focus',
      invalid: 'stripe-input-invalid',
    },
  };
}

const requiredMessage = {
  cardNumber: 'Credit card is a required field',
  cardExpiry: 'Expiration is a required field',
  cardCvc: 'CVV is a required field',
};
