import React from 'react';
import { useForm } from 'react-hook-form';
import { useDialogState } from 'reakit';
import { PATHS } from 'AppPaths';
import { lightFormat } from 'date-fns';
import { useStore } from 'effector-react';

import { cart$, picker_state$, postcode$, resetCart } from 'features/cart';

import { history } from 'libs/history';
import { CHECKOUT } from 'api';

import { Button, Field, inputStyle, Modal, Row } from 'ui';

import { ReactComponent as Doc } from 'assets/images/icon/document.svg';
import { ReactComponent as IconName } from 'assets/images/icon/icons8-name.svg';
import { ReactComponent as IconPhone } from 'assets/images/icon/icons8-phone.svg';
import { ReactComponent as IconMail } from 'assets/images/icon/icons8-secured_letter.svg';

export function PayLater() {
  const dialog = useDialogState();
  const { register, handleSubmit, reset } = useForm();
  const { endDate, startDate } = useStore(picker_state$);
  const postcode = useStore(postcode$);
  const cart = useStore(cart$);
  const [loading, setloading] = React.useState(false);

  const onSubmit = async data => {
    setloading(true);
    try {
      const { email, name, phone } = data;
      await CHECKOUT.go({
        pay_later: true,
        hire_start_date: lightFormat(startDate, 'yyyy-MM-dd'),
        hire_end_date: lightFormat(endDate, 'yyyy-MM-dd'),
        ...(postcode && postcode),
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
      reset();
      resetRedirect();
    } catch (e) {
      console.warn(e);
    } finally {
      setloading(false);
    }
  };

  const disclosure = <Button prefixIcon={<Doc />}> Get Quote</Button>;

  return (
    <Modal
      disclosure={disclosure}
      title="Fill all fields please"
      dialogState={dialog}
      width={400}
    >
      <Row
        direction="column"
        align="stretch"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Field legend="Full name" icon={IconName} className="my-3" req>
          <input
            name="name"
            ref={register}
            required
            type="text"
            placeholder="Full name"
            className={inputStyle}
          />
        </Field>
        <Field legend="Phone number" icon={IconPhone} className="my-3" req>
          <input
            name="phone"
            ref={register}
            required
            className={inputStyle}
            type="text"
            placeholder="Phone number"
          />
        </Field>
        <Field legend="E-mail" icon={IconMail} className="my-3" req>
          <input
            name="email"
            ref={register}
            required
            className={inputStyle}
            type="email"
            placeholder="E-mail"
          />
        </Field>
        <Button
          prefixIcon={<Doc />}
          small
          className="mt-3"
          type="submit"
          loading={loading}
        >
          Get Quote
        </Button>
      </Row>
    </Modal>
  );
}

function resetRedirect() {
  resetCart();
  history.replace(PATHS.SUCCESS_PAY_LATER);
}
