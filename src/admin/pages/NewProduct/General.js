import React from 'react';
import { useStore } from 'effector-react';
import { styled } from 'linaria/react';

import { categories$ } from 'features/products';

import { More } from './shared';

import { Cell, Checkbox, Field, Grid, inputStyle, T8y } from 'ui';

export const General = ({ register }) => {
  const categories = useStore(categories$);

  return (
    <>
      <T8y as={title} variant="h2">
        General information
      </T8y>
      <Grid as={Block} gaps="2rem 3rem" cols="repeat(3, 1fr)" places="center">
        <FieldStyle as={Field} legend="Сategory">
          <select
            name="category_id"
            ref={register}
            className={inputStyle}
            required
          >
            <option></option>
            <RecursiveOptions data={categories} level={1} />
          </select>
        </FieldStyle>
        <FieldStyle as={Field} legend="Price">
          <input
            name="price"
            type="number"
            className={inputStyle}
            required
            ref={register}
          />
        </FieldStyle>
      </Grid>

      <Grid as={Block} gaps="2rem 2rem" cols="1fr 2fr" places="center start">
        <Checkbox label="Return dirty applicable" />

        <Checkbox label="Slight Damage waiver fee applicable (+2.5%)" />
      </Grid>

      <Grid
        as={Block}
        marginTop
        marginBottom
        gaps="2rem 2rem"
        cols="2fr 2fr 1fr"
        places="center start"
      >
        <Cell as={Full} area="/ span 3">
          <Field legend="Title">
            <input
              name="display_name"
              type="text"
              className={inputStyle}
              required
              ref={register}
            />
          </Field>
        </Cell>
        <Cell as={Full} area="/ span 3">
          <Field legend="Sku">
            <input
              name="sku"
              type="number"
              className={inputStyle}
              required
              ref={register}
            />
          </Field>
        </Cell>

        <Cell as={Full} area="/ span 3">
          <Field legend="Description">
            <textarea
              name="description"
              rows="4"
              className={inputStyle}
              ref={register}
              placeholder="Description"
            />
          </Field>
        </Cell>

        {/* <Cell as={Full}>
          <Field legend="Feature 1">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>
        </Cell>

        <Cell as={Full}>
          <Field legend="Feature 2">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>
        </Cell>

        <Cell place="center">
          <More marginTop />
        </Cell>

        <Cell as={Full}>
          <Field legend="Feature 2">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>
        </Cell>

        <Cell as={Full}>
          <Field legend="Feature 2">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>
        </Cell> */}
      </Grid>
    </>
  );
};

const RecursiveOptions = ({ data, level }) => {
  return data.map(({ name, id, childs }) => {
    return (
      <>
        <option value={id} key={id} style={{ fontSize: 13 * (1 + 1 / level) }}>
          {Array.from({ length: level }, _ => '*')}
          {name}
        </option>
        {childs.length && <RecursiveOptions data={childs} level={level + 1} />}
      </>
    );
  });
};

const title = styled.h2`
  margin-bottom: 2rem;
`;

const FieldStyle = styled.div`
  width: 100%;
`;
const Full = styled.div`
  width: 100%;
  margin-top: ${props => (props.marginTop ? '2rem' : 0)};
  margin-bottom: ${props => (props.marginBottom ? '3rem' : 0)};
`;

const Block = styled.div`
  width: 100%;
  margin-top: ${props => (props.marginTop ? '2rem' : 0)};
  margin-bottom: ${props => (props.marginBottom ? '3rem' : 0)};
  padding: 2rem 2rem;
  background: #fff;
`;
