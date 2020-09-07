import React from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, DisclosureContent, useDisclosureState } from 'reakit';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';
import { useList, useStore } from 'effector-react';
import { collectionSlot$, deliverySlot$ } from 'pages/delivery/model';

import {
  addItemToCart,
  cart$,
  cartLenght$,
  deliveryMethod$,
  picker_state$,
  postcode$,
  postcodeError$,
  resetCart,
  selectedDiscount$,
  weeksOrder$,
} from 'features/cart';
import { sessionId$ } from 'features/session';

import { CART } from 'api';

import { CartProduct } from './CartProduct/CartProduct';
import { DeliveryMethod } from './DeliveryMethod/DeliveryMethod';
import { selectedWarehous$ } from './DeliveryMethod/warehousesModel';
import { FAQ } from './Faq/Faq';
import { Header } from './Header/Header';
import { PayLater } from './PayLater/PayLater';

import { Button, Center, DatePickerDisclosure, Row, Spinner, T8y } from 'ui';

import { ReactComponent as Info } from 'assets/images/icon/info.svg';
import { ReactComponent as Plus } from 'assets/images/icon/plus.svg';

import style from './cart.module.scss';

export function Cart({
  match: {
    params: { orderId },
  },
}) {
  const cartLenght = useStore(cartLenght$);
  const [loadingOrderDetail, setloadingOrderDetail] = React.useState(true);

  React.useEffect(() => {
    if (orderId) {
      (async () => {
        resetCart();
        try {
          const {
            data: {
              data: { products },
            },
          } = await CART.getOrder(orderId);
          products.forEach(e => {
            const { extra } = e;
            const optionalExtra = extra.find(
              ({ name }) => name === 'optional extra',
            );
            const optionalSaleExtra = extra.find(
              ({ name }) => name === 'optional sale extra',
            );
            const reqExtra = extra.find(
              ({ name }) => name === 'required extra',
            );

            addItemToCart({
              id: e.id,
              count: e.quantity,
              product: e,
              optionalExtra,
              optionalSaleExtra,
              reqExtra,
            });
          });
        } catch {
        } finally {
          setloadingOrderDetail(false);
        }
      })();
    }
  }, [orderId]);

  if (loadingOrderDetail && orderId)
    return (
      <Center>
        <Spinner dark size={4} />
      </Center>
    );

  return (
    <div className="container">
      <Header />
      <CartInner />
      <br />
      {!!cartLenght && (
        <Row justify="stretch" align="center">
          <T8y as={Link} to={PATHS.PRODUCTS} asLink color="primary">
            <Row align="center" inline>
              <Plus className="mr-3" />
              Add more products
            </Row>
          </T8y>
          <PayLater />
        </Row>
      )}
      {!!cartLenght && <DeliveryMethod />}
      <Row className={style.chekout} justify="stretch">
        <FAQ />
        {!!cartLenght && <TotalPrice buttons />}
      </Row>
    </div>
  );
}

export function CartInner() {
  const cartLenght = useStore(cartLenght$);

  if (!cartLenght)
    return (
      <Row justify="center" className={style.emptyBadge}>
        <T8y bold variant="h2">
          Your quote is empty. Please browse our{' '}
          <T8y
            as={Link}
            variant="h2"
            to={PATHS.PRODUCTS}
            color="primary"
            asLink
          >
            catalogue
          </T8y>{' '}
          and find what you want.
        </T8y>
      </Row>
    );
  return <CartItems />;
}

export function CartItems() {
  return useList(cart$, item => (
    <React.Fragment key={item.id}>
      <CartProduct
        quantity={item.count}
        cartItem={item}
        returnDirty={item.returnDirty}
        {...item.product}
      />
      {item.reqExtra && (
        <CartProduct
          image={item.reqExtra.src}
          name={item.reqExtra.value}
          price={item.reqExtra.price}
          id={item.reqExtra.id}
          quantity={item.count}
          slug={item.product.slug}
          extra={item.reqExtra}
          extraType="reqExtra"
          isExtra
        />
      )}
      {item.optionalExtra && (
        <CartProduct
          image={item.optionalExtra.src}
          name={item.optionalExtra.value}
          price={item.optionalExtra.price}
          id={item.optionalExtra.id}
          quantity={item.count}
          slug={item.product.slug}
          extra={item.optionalExtra}
          extraType="optionalExtra"
          isExtra
        />
      )}
      {item.optionalSaleExtra && (
        <CartProduct
          image={item.optionalSaleExtra.src}
          name={item.optionalSaleExtra.value}
          price={item.optionalSaleExtra.price}
          id={item.optionalSaleExtra.id}
          quantity={item.count}
          slug={item.product.slug}
          extra={item.optionalSaleExtra}
          extraType="optionalSaleExtra"
          isExtra
        />
      )}
    </React.Fragment>
  ));
}

export function Submit({ percent }) {
  const postcode = useStore(postcode$);
  const postcodeError = useStore(postcodeError$);
  const weeks = useStore(weeksOrder$);
  const { method } = useStore(deliveryMethod$);
  const { id: selectedWarehousId } = useStore(selectedWarehous$);

  const isSelf = method === 'self';
  const deliveryMethodError = isSelf && !selectedWarehousId;
  const postcodeSumError = !isSelf && (postcodeError || postcode.length < 5);
  const someError = !weeks || postcodeSumError || deliveryMethodError;

  if (someError)
    return (
      <div className={style.buttons}>
        {!weeks && (
          <DatePickerDisclosure as={T8y} variant="t1" color="primary" asLink>
            Select dates first
          </DatePickerDisclosure>
        )}
        {postcodeSumError && (
          <T8y variant="t1" color="primary">
            Please enter a valid postcode
          </T8y>
        )}
        {deliveryMethodError && (
          <T8y variant="t1" color="primary">
            Please select depot for self collection
          </T8y>
        )}
      </div>
    );

  return (
    <div className={style.buttons}>
      <Button
        as={Link}
        to={isSelf ? PATHS.CHECKOUT : PATHS.DELIVERY_TIME_SELECT('delivery')}
        className="mb-3"
        postfix={percent && `-${percent}%`}
      >
        Checkout
      </Button>
    </div>
  );
}

export function Discount({ percent, name }) {
  return (
    <div className={style.yourDiscount}>
      <T8y variant="t1" bold color="primary" className={style.title}>
        <Info className="mr-2" /> Your discount
      </T8y>
      <T8y variant="t3">
        <T8y as="span" color="primary">
          - {percent}%
        </T8y>{' '}
        {name}
      </T8y>
      <T8y color="primary" className="mt-5" variant="t3">
        *Discount not available on “Pay later” orders
      </T8y>
    </div>
  );
}

export function TotalPrice({ buttons, isLater }) {
  const { startDate, endDate } = useStore(picker_state$);
  const postcode = useStore(postcode$);
  const postcodeError = useStore(postcodeError$);
  const sessionId = useStore(sessionId$);
  const cart = useStore(cart$);
  const weeks = useStore(weeksOrder$);
  const { id: delivery_price_id } = useStore(deliverySlot$);
  const { id: collection_price_id } = useStore(collectionSlot$);
  const selectedDiscount = useStore(selectedDiscount$);
  const { method } = useStore(deliveryMethod$);
  const isSelf = method === 'self';
  const { id: selectedWarehousId } = useStore(selectedWarehous$);

  const [prices, setprices] = React.useState({});
  const [loading, setloading] = React.useState(true);

  React.useEffect(() => {
    if (weeks && !postcodeError) {
      setloading(true);
      CART.getTotalPrice({
        session_id: sessionId,
        start_date: startDate,
        end_date: endDate,
        ...(isLater && { pay_later: true }),
        ...(selectedWarehousId && { warehouse_id: Number(selectedWarehousId) }),
        ...(!isSelf && { postcode }),
        ...(delivery_price_id && { delivery_price_id }),
        ...(collection_price_id && { collection_price_id }),
        products: cart.map(
          ({
            id,
            count: quantity,
            reqExtra,
            optionalExtra,
            optionalSaleExtra,
            returnDirty,
          }) => ({
            id,
            quantity,
            is_return_dirty: returnDirty,
            attributes: [reqExtra?.id, optionalExtra?.id, optionalSaleExtra?.id]
              .filter(Boolean)
              .map(e => ({ id: e, quantity })),
          }),
        ),
      })
        .then(({ data }) => {
          setprices(data.data);
          setloading(false);
        })
        .catch(err => {
          setprices({});
          setloading(false);
          console.warn(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cart,
    weeks,
    postcode,
    startDate,
    endDate,
    sessionId,
    postcodeError,
    delivery_price_id,
    collection_price_id,
    selectedWarehousId,
  ]);

  const percent = prices?.discount_details?.value;

  if (!weeks && buttons) return <Submit percent={percent} />;

  return (
    <>
      {prices?.discount !== 0 && (
        <Discount percent={percent} name={selectedDiscount?.name} />
      )}

      <Row direction="column" align="stretch" className={style.prices}>
        {loading ? (
          <Center>
            <Spinner dark />
          </Center>
        ) : (
          <>
            <div className={style.priceCard}>
              <HorizontalLabel
                title="Subtotal"
                value={prices?.subtotal?.toFixed(2)}
              />
              {prices?.discount !== 0 && (
                <HorizontalLabel
                  title={`Discount (${percent}%)`}
                  value={prices?.discount?.toFixed(2)}
                  discount={true}
                />
              )}
              <HorizontalLabel
                title="Damage waiver"
                value={prices?.slight_damage_fee}
              />
              {!isSelf && (
                <HorizontalLabel
                  title="Transport"
                  value={prices?.delivery?.toFixed(2)}
                />
              )}
              <HorizontalLabel
                title="Vat (20%)"
                value={prices?.tax?.toFixed(2)}
              />
              <HorizontalLabel
                title="Total"
                total
                value={prices?.total?.toFixed(2)}
              />
            </div>
            <div className={clsx([style.priceCard, style.editional])}>
              <HorizontalLabelToggle title="Deposit" value={prices?.deposit} />
            </div>
            {buttons && <Submit percent={percent} />}
          </>
        )}
      </Row>
    </>
  );
}

function HorizontalLabel({ title, value, total, discount }) {
  return (
    <Row className={style.price} align="center" justify="stretch">
      <T8y
        variant="t2"
        color={discount ? (total ? 'secondary' : 'primary') : ''}
        className={style.priceTitle}
      >
        {title}:
      </T8y>
      <T8y
        variant={total ? 'h2' : 't2'}
        color={discount ? 'primary' : 'secondary'}
        className={style.horizontalLabelValue}
      >
        {discount && '- '}£{value}
      </T8y>
    </Row>
  );
}

function HorizontalLabelToggle({ title, value }) {
  const disclosure = useDisclosureState({ visible: false });
  return (
    <>
      <Row className={style.price} align="center" justify="stretch">
        <Disclosure
          {...disclosure}
          as={T8y}
          variant="t1"
          color="primary"
          asLink
        >
          {title}:
        </Disclosure>
        <T8y variant="mainText" className={style.horizontalLabelValue}>
          £{value}
        </T8y>
      </Row>
      <DisclosureContent {...disclosure}>
        <Row className={style.description}>
          The loss & damage deposit will be returned to your card upon safe
          return of the inventory
        </Row>
      </DisclosureContent>
    </>
  );
}
