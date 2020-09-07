import React, { useState } from 'react';

import { IMPORT } from 'api';

import { Button, Center, Row } from 'ui';

import {
  box,
  button,
  container,
  form,
  header,
  input,
  title,
} from './Login/login.module.scss';

export const Upload = ({ history }) => {
  //const [loading, setloading] = useState(true);

  // useEffect(() => {
  //   AUTH.me()
  //     .then(({ data }) => {
  //       setloading(false);
  //     })
  //     .catch(({ response }) => {
  //       if (response.status === 401) {
  //         removeToken();
  //         history.push(PATHS.LOGIN);
  //       }
  //     });
  // }, [history]);

  // if (loading) {
  //   return (
  //     <Center>
  //       <Spinner dark size={5} />;
  //     </Center>
  //   );
  // }

  return (
    <Center>
      <div className={container}>
        <div className={box}>
          <div className={header}>
            <h3 className={title}>Upload Categories</h3>
          </div>
          <UploadForm aceptType=".json" type="categories" />
        </div>
        <div className={box}>
          <div className={header}>
            <h3 className={title}>Upload Products</h3>
          </div>
          <UploadForm aceptType=".csv" type="products" />
        </div>
      </div>
    </Center>
  );
};

const UploadForm = ({ aceptType, type }) => {
  const { onChange, loading, error, text } = useUpload(type);

  return (
    <div className={form}>
      <Row justify="center">
        <Button as="label" loading={loading} className={button}>
          {text}
          <input
            onChange={onChange}
            type="file"
            accept={aceptType}
            style={{ display: 'none' }}
          />
        </Button>
      </Row>
      {error}
    </div>
  );
};

const useUpload = type => {
  const [loading, setloading] = useState(false);
  const [text, settext] = useState('Select File');
  const onChange = async ({ target }) => {
    setloading(true);
    try {
      if (type === 'categories') {
        const file = await toJson(target.files[0]);
        await IMPORT.importCategories(file);
      }
      if (type === 'products') {
        const file = await toBase64(target.files[0]);
        const {
          data: { job_status_id },
        } = await IMPORT.importProducts(file);
        await pollingStatusUploadCsv(job_status_id);
      }
      settext('Uploaded');
      setTimeout(settext, 3000, 'Select File');
    } catch (e) {
      settext('Upload failed');
      setTimeout(settext, 3000, 'Select File');
    }
    setloading(false);
  };
  return { onChange, loading, text };
};

const toJson = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const pollingStatusUploadCsv = id =>
  new Promise((resolve, reject) => {
    (async function poll() {
      const {
        data: { status },
      } = await IMPORT.getImportStatus(id);
      if (
        status === 'queued' ||
        status === 'executing' ||
        status === 'retrying'
      ) {
        setTimeout(poll, 500);
      }
      if (status === 'finished') {
        resolve({ status });
      }
      if (status === 'failed') {
        reject();
      }
    })();
  });
