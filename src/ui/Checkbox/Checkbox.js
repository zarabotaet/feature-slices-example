import React from 'react';
import { Button, Checkbox as CheckboxR, useCheckboxState } from 'reakit';

import { Row, T8y } from 'ui';

import style from './checkbox.module.scss';

export const Checkbox = React.forwardRef(
  ({ label, checked, onChange, policy }, ref) => {
    const checkbox = useCheckboxState({ state: checked });

    return (
      <CheckboxR
        as={Button}
        checked={checked}
        onChange={onChange}
        ref={ref}
        {...checkbox}
      >
        <Row align="center" className={policy && style.policy}>
          <div className={style.checkbox} />
          <T8y as="span">{label}</T8y>
        </Row>
      </CheckboxR>
    );
  },
);
