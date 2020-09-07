import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { PATHS } from 'admin/AdminAppPaths';

import { history } from 'libs/history';
import { PRODUCTS } from 'admin/api';

import { General } from './General';
import {
  Buttons,
  EventTypes,
  Extra,
  Faq,
  Review,
  RowInfo,
  Specifications,
  Together,
  UploadGuides,
  UploadPhotos,
  Variations,
} from './shared';

import { Grid } from 'ui';

export const Product = () => {
  const { handleSubmit, register } = useForm();
  const [loading, setloading] = React.useState(false);

  const onSubmit = async data => {
    setloading(true);

    try {
      await PRODUCTS.create(data);

      toast(`Product ${data.display_name} was created`);

      history.push(PATHS.PRODUCTS);
    } catch (err) {
      console.warn(err);
    } finally {
      setloading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RowInfo loading={loading} />

      <Grid cols="3fr 1fr" gaps="0 2rem">
        <div>
          {/* <Variations /> */}
          <General register={register} />
        </div>

        {/* <div>
          <UploadPhotos />
          <UploadGuides />
        </div> */}
      </Grid>

      {/* <Specifications />
      <EventTypes />
      <Faq />
      <Review />
      <Together />
      <Extra />
      <Buttons /> */}
    </form>
  );
};
