import React from 'react';
import { Link } from 'react-router-dom';
import { Button as ButtonR } from 'reakit';
import { PATHS } from 'AppPaths';
import { useList, useStore } from 'effector-react';
import { selectedWarehous$ } from 'pages/cart/DeliveryMethod/warehousesModel';
import { collectionSlot$, deliverySlot$ } from 'pages/delivery/model';

import {
  cart$,
  cartLenght$,
  deleteItemFromCart,
  deliveryMethod$,
  editItemInCart,
  end_date$,
  postcode$,
  postcodeError$,
  start_date$,
  weeksOrder$,
} from 'features/cart';
import { DeliverySelect, SizeSelect } from 'features/filter';
import { sessionId$ } from 'features/session';

import { CART } from 'api';

import {
  Button,
  Center,
  DatePickerInput,
  QuantityChanger,
  Row,
  Spinner,
  T8y,
} from 'ui';

import { ReactComponent as Cross } from 'assets/images/icon/cart/cross.svg';
import { ReactComponent as EqualIcon } from 'assets/images/icon/cart/equal.svg';
import { ReactComponent as Triangl } from 'assets/images/icon/Triangl.svg';

import style from './rightMenu.module.scss';

export function RightMenu() {
  return (
    <div className={style.menu}>
      <div className={style.section}>
        <Row className={style.title} align="center">
          <Triangl />
          Event details
        </Row>
        <DatePickerInput
          className={style.row}
          edge="start"
          legend="Event start date"
        />
        <DatePickerInput className={style.row} edge="end" legend="End date" />

        <SizeSelect className={style.row} />
        <DeliverySelect className={style.row} sidebar />
      </div>
      <CartWidget />
    </div>
  );
}

function CartWidget() {
  const cartLenght = useStore(cartLenght$);

  if (!cartLenght) return null;

  return (
    <div className={style.section}>
      <Row className={style.title} align="center">
        <Triangl />
        Items in your quote
      </Row>
      <CartItems />
      <TotalPrice />
      <Button as={Link} to={PATHS.CART} small>
        Proceed to checkout
      </Button>
    </div>
  );
}
function CartItems() {
  return useList(cart$, item => (
    <CartItem
      {...item.product}
      count={item.count}
      id={item.id}
      optionalExtra={item.optionalExtra}
      reqExtra={item.reqExtra}
      cartItem={item}
    />
  ));
}
function CartItem({
  image,
  name,
  count,
  id,
  optionalExtra,
  reqExtra,
  cartItem,
  price,
}) {
  const weeks = useStore(weeksOrder$);

  // 100 trick for avoid https://0.30000000000000004.com/
  const priceForSelectedWeeks = (price * 100 * weeks) / 100;
  const total = (priceForSelectedWeeks * 100 * count) / 100;

  return (
    <Row className={style.cartItem} align="center" noWrap>
      <div className={style.cartImg} onClick={() => deleteItemFromCart(id)}>
        <ButtonR
          as={Row}
          justify="center"
          align="center"
          className={style.cartDelete}
        >
          <Cross />
        </ButtonR>
        <img src={image} alt="" />
      </div>
      <div>
        <T8y variant="t3">
          {name}
          {optionalExtra && `+${optionalExtra.value}`}
          {reqExtra && `+${reqExtra.value}`}
        </T8y>
        <Row align="center">
          <QuantityChanger
            small
            startCount={count}
            changeCount={e => {
              editItemInCart({ ...cartItem, count: e });
            }}
          />
          <Cross width={8} className="mx-1" />
          <T8y variant="t3">{`£${priceForSelectedWeeks}`}</T8y>
          <EqualIcon width={8} className="mx-1" />
          <T8y variant="t3" className={style.col}>{`£${total}`}</T8y>
        </Row>
      </div>
    </Row>
  );
}
function TotalPrice() {
  const start_date = useStore(start_date$);
  const end_date = useStore(end_date$);
  const postcode = useStore(postcode$);
  const cart = useStore(cart$);
  const { id: delivery_price_id } = useStore(deliverySlot$);
  const { id: collection_price_id } = useStore(collectionSlot$);
  const sessionId = useStore(sessionId$);
  const weeks = useStore(weeksOrder$);
  const postcodeError = useStore(postcodeError$);
  const { method } = useStore(deliveryMethod$);
  const isSelf = method === 'self';
  const { id: selectedWarehousId } = useStore(selectedWarehous$);
  const [prices, setprices] = React.useState({});
  const [loading, setloading] = React.useState(true);
  const [toggle, settoggle] = React.useState(false);

  React.useEffect(() => {
    if (weeks) {
      setloading(true);
      CART.getTotalPrice({
        session_id: sessionId,
        start_date: fomatDate(start_date),
        end_date: fomatDate(end_date),
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
  }, [
    cart,
    weeks,
    postcode,
    start_date,
    end_date,
    sessionId,
    postcodeError,
    selectedWarehousId,
    isSelf,
    delivery_price_id,
    collection_price_id,
  ]);

  if (!weeks) return null;

  if (loading)
    return (
      <Center>
        <Spinner dark />
      </Center>
    );

  const percent = prices?.discount_details?.value;

  return (
    <>
      <div className={style.totalPrice}>
        {!isSelf && (
          <T8y>
            Transport:{' '}
            {prices?.delivery ? `£${prices?.delivery?.toFixed(2)}` : '-'}
          </T8y>
        )}

        <T8y>Damage waiver: £{prices?.slight_damage_fee}</T8y>

        {prices?.discount !== 0 && (
          <T8y color="primary">
            <Row onClick={() => settoggle(!toggle)}>
              <span className={style.toggle}>Discount (-{percent}%):</span> £
              {prices?.discount?.toFixed(2)}
            </Row>
            {toggle && (
              <T8y className={style.discount}>
                -{percent}% <span>{prices?.discount_details?.name}</span>
              </T8y>
            )}
          </T8y>
        )}

        <T8y>Vat (20%): £{prices?.tax?.toFixed(2)}</T8y>
        <T8y>
          Total:{' '}
          <T8y bold as="span">
            £{prices?.total?.toFixed(2)}
          </T8y>
        </T8y>
      </div>
    </>
  );
}

function fomatDate(d) {
  return d.split('/').join('-');
}
