import React from 'react';
import { Button } from 'reakit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { packagesData$ } from 'features/filter';

import { PRODUCTS } from 'api';

import { ProductCard, Row, Slider, T8y } from 'ui';

import style from './popularProducts.module.scss';

const settings = {
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};

const usePopularProductData = selectedPackage => {
  const [products, setproducts] = React.useState([]);
  const [loading, setloading] = React.useState(true);

  React.useEffect(() => {
    PRODUCTS.getPopular(selectedPackage).then(({ data }) => {
      setproducts(data.data);
      setloading(false);
    });
  }, [selectedPackage]);

  return { products, loading };
};

const useProductData = (apiCall, slug) => {
  const [products, setproducts] = React.useState([]);
  const [loading, setloading] = React.useState(true);

  React.useEffect(() => {
    if (slug) {
      apiCall(slug).then(({ data }) => {
        setproducts(data.data || data.response);
        setloading(false);
      });
    }
  }, [apiCall, slug]);

  return { products, loading };
};

export function PopularProducts({ className }) {
  const [selectedPackage, setPackage] = React.useState('All');
  const { products } = usePopularProductData(selectedPackage);

  return (
    <div className={clsx('container', style.container, className)}>
      <div className="row">
        <div className="col">
          <HeaderPopular
            selectedPackage={selectedPackage}
            setPackage={setPackage}
          />
          {products.length ? (
            <Slider
              slidesToShow={4}
              {...settings}
              className={clsx('nav-links', style.sliderWrap)}
            >
              {products.map((item, i) => (
                <div key={item.id} className={style.sliderCell}>
                  <ProductCard {...item} />
                </div>
              ))}
            </Slider>
          ) : (
            <Row justify="center" as={T8y} variant="h2">
              No popular products for this package
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}
function HeaderPopular({ selectedPackage, setPackage }) {
  const packages = useStore(packagesData$);

  return (
    <Row className={style.header} align="center">
      <h3 className={style.title}>Popular products</h3>
      <div className={style.tags}>
        {packages.map(({ name }) => (
          <Button
            key={name}
            className={clsx(style.tag, {
              [style.active]: selectedPackage === name,
            })}
            onClick={() => setPackage(name)}
          >
            {name}
          </Button>
        ))}
      </div>
    </Row>
  );
}
export function RecentlyViewedProducts({ className, slug, anchor }) {
  const { products } = useProductData(PRODUCTS.getRecentlyViewed, slug);

  return (
    <div className={clsx(style.container, className)} id={anchor}>
      <T8y variant="h1" as="h3" color="primary" id={anchor}>
        Recently viewed by others
      </T8y>
      <Slider slidesToShow={4} {...settings} className={style.sliderWrap}>
        {products.map((item, i) => (
          <div key={item.id} className={style.sliderCell}>
            <ProductCard {...item} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
export function HiredTogetherProducts({ className, slug, anchor }) {
  const { products } = useProductData(PRODUCTS.getHiredTogether, slug);

  return (
    <div className={clsx(style.container, className)} id={anchor}>
      <T8y variant="h1" as="h3" color="primary">
        Frequently hired together
      </T8y>
      <Slider slidesToShow={4} {...settings} className={style.sliderWrap}>
        {products.map((item, i) => (
          <div key={item.id} className={style.sliderCell}>
            <ProductCard {...item} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
