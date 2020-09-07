import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PATHS } from 'admin/AdminAppPaths';

import { setToken } from 'admin/api';
import { AUTH } from 'api';

import { Button, Center, Field, inputStyle, Row, T8y } from 'ui';

import { ReactComponent as PassIcon } from 'assets/images/icon/lock.svg';
import { ReactComponent as NameIcon } from 'assets/images/icon/user_name.svg';

import { box, button, form, header, inputRoll } from './login.module.scss';

export const Login = ({ history }) => {
  const [loading, setloading] = useState(false);
  const { register, handleSubmit, errors, setError } = useForm({
    mode: 'onChange',
  });

  async function onSubmit({ email, password }) {
    setloading(true);
    try {
      const { data } = await AUTH.login({ email, password });
      setToken(data.access_token);
      history.push(PATHS.PRODUCTS);
    } catch (e) {
      if (e.response?.data?.error === 'Unauthorized') {
        setError('email', 'invalidCred', 'Invalid email or password');
        setloading(false);
      }
    }
  }
  return (
    <Center>
      <div className={box}>
        <div className={header}>
          <T8y variant="h2">Please Log In</T8y>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={form}>
          <div className={inputRoll}>
            <Field legend="Username" icon={NameIcon}>
              <input
                ref={register}
                name="email"
                placeholder="Username"
                className={inputStyle}
              />
            </Field>
            <Field legend="Password" icon={PassIcon}>
              <input
                ref={register}
                name="password"
                type="password"
                placeholder="Password"
                className={inputStyle}
              />
            </Field>
          </div>
          <Row justify="center">
            <Button type="submit" className={button} loading={loading}>
              Log In
            </Button>
          </Row>
          <Row as={T8y} justify="center" variant="t2" bold color="danger">
            {errors?.email?.message}
          </Row>
        </form>
      </div>
    </Center>
  );
};
