import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  useDialogState,
} from 'reakit/Dialog';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';
import { useStore } from 'effector-react';
import { ExtraList } from 'pages/product/extra';

import {
  deleteItemFromCart,
  editExtra,
  editItemInCart,
  weeksOrder$,
} from 'features/cart';

import { PRODUCTS } from 'api';

import {
  Checkbox,
  CircleButton,
  Container,
  QuantityChanger,
  Row,
  T8y,
} from 'ui';

import { ReactComponent as Cross } from 'assets/images/icon/cart/cross.svg';
import { ReactComponent as EqualIcon } from 'assets/images/icon/cart/equal.svg';

import style from './cartProduct.module.scss';

export function CartProduct({
  id,
  image,
  name,
  returnDirty,
  price,
  slug,
  quantity,
  isExtra,
  extra,
  extraType,
  cartItem,
}) {
  return (
    <Row
      className={clsx(style.product, { [style.extra]: isExtra })}
      align="center"
      justify="stretch"
    >
      <Row
        as={Link}
        to={PATHS.PRODUCT(slug)}
        className={style.title}
        align="center"
      >
        <img src={image} alt="item2" />
        <T8y variant="t1">{isExtra ? `Extra: ${name}` : name}</T8y>
      </Row>
      <Price
        price={price}
        returnDirty={returnDirty}
        quantity={quantity}
        isExtra={isExtra}
        cartItem={cartItem}
      />
      <Row justify="end" className={style.remove}>
        {isExtra ? (
          <Extra slug={slug} extra={extra} type={extraType} />
        ) : (
          <CircleButton
            type="cross"
            label="Delete"
            onClick={() => deleteItemFromCart(id)}
          />
        )}
      </Row>
    </Row>
  );
}

function Price({ returnDirty, isExtra, quantity, price, cartItem }) {
  const [count, setcount] = React.useState(quantity);
  const [dirty, setdirty] = React.useState(returnDirty);

  React.useEffect(() => {
    editItemInCart({ ...cartItem, count, returnDirty: dirty });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, dirty]);

  const weeks = useStore(weeksOrder$);
  // 100 trick for avoid https://0.30000000000000004.com/
  const priceForSelectedWeeks = (price * 100 * weeks) / 100;
  const priceForRetrunDirty = priceForSelectedWeeks / 5;
  const total =
    ((priceForSelectedWeeks + (dirty ? priceForRetrunDirty : 0)) *
      100 *
      quantity) /
    100;

  return (
    <Row className={style.price} align="center" justify="center">
      {returnDirty !== undefined && (
        <Row direction="column" align="center" className={style.productDirty}>
          <Checkbox
            label="Return Dirty"
            checked={returnDirty}
            onChange={() => setdirty(!dirty)}
          />
          <span className={style.dirtyPrice}>
            + £{priceForRetrunDirty.toFixed(2)} per item
          </span>
        </Row>
      )}
      <div>
        {isExtra ? (
          <T8y variant="t1">{quantity}</T8y>
        ) : (
          <QuantityChanger startCount={count} changeCount={setcount} />
        )}
      </div>
      <Cross width={18} className={style.colIcon} />
      <T8y
        variant="t1"
        className={clsx(style.col, style.colCenter)}
      >{`£${parseFloat(priceForSelectedWeeks).toFixed(2)}`}</T8y>
      <EqualIcon width={8} className={style.colIcon} />
      <T8y variant="t1" className={style.col}>{`£${parseFloat(total).toFixed(
        2,
      )}`}</T8y>
    </Row>
  );
}
function Extra({ slug, extra, type }) {
  const [product, setproduct] = React.useState({});
  const dialog = useDialogState();

  React.useEffect(() => {
    PRODUCTS.getProduct(slug).then(({ data }) => {
      setproduct(data.data);
    });
  }, [slug]);

  return (
    <>
      <DialogDisclosure
        as={T8y}
        variant="t2"
        color="primary"
        asLink
        {...dialog}
      >
        Change Extra
      </DialogDisclosure>
      <DialogBackdrop {...dialog} className={style.backdrop}>
        <Dialog {...dialog} aria-label="extras">
          <Container className={style.extralist}>
            <Row justify="stretch">
              <T8y variant="h2">
                Change
                <T8y variant="h2" color="primary">
                  {type === 'reqExtra' && 'Required extra'}
                  {type === 'optionalExtra' && 'Optional extra'}
                  {type === 'optionalSaleExtra' && 'Optional sale extra'}
                </T8y>
              </T8y>
              <Cross onClick={dialog.hide} className={style.extraClose} />
            </Row>

            <ExtraList
              extras={product?.attributes?.filter(({ name }) =>
                type === 'reqExtra'
                  ? name === 'required extra'
                  : name === 'optional extra' || name === 'optional sale extra',
              )}
              onChange={extra => {
                editExtra({ id: product.id, extra, type });
              }}
              selected={extra}
            />
          </Container>
        </Dialog>
      </DialogBackdrop>
    </>
  );
}
