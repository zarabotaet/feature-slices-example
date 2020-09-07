import React from 'react';
import { Link } from 'react-router-dom';
import {
  Disclosure,
  DisclosureContent,
  Tab,
  TabList,
  TabPanel,
  useDisclosureState,
  useTabState,
} from 'reakit';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';
import { useStore, useStoreMap } from 'effector-react';
import { Meta } from 'seo';

import {
  addItemToCart,
  cart$,
  cartLenght$,
  editItemInCart,
  picker_state$,
  postcode$,
  weeksOrder$,
} from 'features/cart';
import { DiscountBadge } from 'features/discount';
import {
  HiredTogetherProducts,
  RecentlyViewedProducts,
  RightMenu,
} from 'features/products';
import { sessionId$ } from 'features/session';

import { CART, PRODUCTS } from 'api';

import { Extra } from './extra';

import {
  Button,
  DatePickerDisclosure,
  DatePickerInput,
  QuantityChanger,
  Rating,
  Row,
  Slider,
  Spinner,
  T8y,
} from 'ui';

import { ReactComponent as Basket } from 'assets/images/icon/buttonBasket.svg';
import { ReactComponent as Guid } from 'assets/images/icon/Guid.svg';
import { ReactComponent as Size } from 'assets/images/icon/Size.svg';
import { ReactComponent as Checked } from 'assets/images/icon/subcategory--checked.svg';
import { ReactComponent as Subtract } from 'assets/images/icon/Subtract.svg';

import style from './product.module.scss';

const useProductData = id => {
  const [product, setproduct] = React.useState({});
  const [loading, setloading] = React.useState(true);
  React.useEffect(() => {
    PRODUCTS.getProduct(id).then(({ data }) => {
      setproduct(data.data);
      setloading(false);
    });
  }, [id]);
  return { product, loading };
};
const useAddingStepper = (attributes = []) => {
  const [addingProcess, setaddingProcess] = React.useState('pending');
  const [selectingDetails, setselectingDetails] = React.useState({});
  const [reqExtra, setreqExtra] = React.useState(null);
  const [optionalExtra, setoptionalExtra] = React.useState(null);

  const showReqExtra =
    addingProcess !== 'pending' &&
    attributes.some(({ name }) => name === 'required extra');

  const showOptionalExtra =
    addingProcess === 'step2' &&
    attributes.some(
      ({ name }) => name === 'optional extra' || name === 'optional sale extra',
    );

  React.useEffect(() => {
    if (
      addingProcess === 'step1' &&
      (!attributes.some(({ name }) => name === 'required extra') || reqExtra)
    ) {
      setaddingProcess('step2');
    }
    if (
      addingProcess === 'step2' &&
      (!attributes.some(
        ({ name }) =>
          name === 'optional extra' || name === 'optional sale extra',
      ) ||
        optionalExtra)
    ) {
      setaddingProcess('step3');
    }
    if (addingProcess === 'step3') {
      const optionalSaleExtra =
        optionalExtra?.name === 'optional sale extra' ? optionalExtra : null;
      const optionalExtraFiltered =
        optionalExtra?.name !== 'optional sale extra' ? optionalExtra : null;
      addItemToCart({
        ...selectingDetails,
        reqExtra,
        optionalExtra: optionalExtraFiltered,
        optionalSaleExtra,
      });
      setaddingProcess('pending');
      setreqExtra(null);
      setoptionalExtra(null);
    }
  }, [attributes, addingProcess, selectingDetails, reqExtra, optionalExtra]);

  return {
    setselectingDetails,
    setaddingProcess,
    showReqExtra,
    showOptionalExtra,
    setoptionalExtra,
    setreqExtra,
    reqExtra,
    optionalExtra,
  };
};

export function Product({ match }) {
  const { product, loading } = useProductData(match.params.id);
  const tab = useTabState({ selectedId: 'tab1' });
  const cartLenght = useStore(cartLenght$);

  const {
    setaddingProcess,
    setselectingDetails,
    showReqExtra,
    showOptionalExtra,
    setreqExtra,
    setoptionalExtra,
    optionalExtra,
    reqExtra,
  } = useAddingStepper(product?.attributes);

  if (loading && !product?.name)
    return <Spinner dark size={5} className="my-5" />;

  return (
    <Row noWrap>
      <Meta
        product={{ title: product?.name, description: product?.description }}
      />
      <div className={style.container}>
        {showReqExtra && (
          <Extra
            type="req"
            onChange={setreqExtra}
            productName={product.name}
            selected={reqExtra}
            extras={product?.attributes?.filter(
              ({ name }) => name === 'required extra',
            )}
          />
        )}
        {showOptionalExtra && (
          <Extra
            onSkip={() => setaddingProcess('step3')}
            onChange={setoptionalExtra}
            productName={product.name}
            selected={optionalExtra}
            extras={product?.attributes?.filter(
              ({ name }) =>
                name === 'optional extra' || name === 'optional sale extra',
            )}
          />
        )}
        <div
          className={clsx('row d-lg-none mb-4 px-0 py-3', style.counterWrap)}
        >
          <div className="col d-flex flex-wrap">
            <div className="d-flex mr-4">
              <DatePickerInput
                edge="start"
                legend="Hire start date"
                className="mr-4"
                style={{ minWidth: '15rem' }}
              />
              <DatePickerInput
                edge="end"
                legend="Hire end date"
                style={{ minWidth: '15rem' }}
              />
            </div>
            <div className="d-flex flex-column justify-content-between mt-4">
              <T8y variant="t1">Items in quote: {cartLenght} </T8y>
              <TotalPrice />
            </div>
          </div>
        </div>
        <div className="row flex-column flex-lg-row">
          <div className="col col-lg-6 col-xl-5 order-lg-2">
            <div className={clsx('ml-lg-4', style.productAdditional)}>
              <BreadCrumbs
                name={product.name}
                sub={product?.category?.parent}
              />
              <Desc attributes={product.attributes} />
              <ButtonPanel
                product={product}
                setaddingProcess={setaddingProcess}
                setselectingDetails={setselectingDetails}
              />
              <div className={style.discountBadge}>
                <DiscountBadge />
              </div>
              <div className={clsx('d-none d-lg-flex', style.tableAndInfo)}>
                <PriceTable price={Number(product?.price)} />
                <div className={style.mainInfoBlock}>
                  {product?.attributes?.some(
                    ({ name }) => name === 'measurements',
                  ) && (
                    <div className={clsx('d-flex', style.size)}>
                      <Size />
                      <div className={style.sizeItem}>
                        <T8y variant="t3" bold>
                          Dimensions of the unit
                        </T8y>
                        <T8y variant="t3" className={style.sizeTxt}>
                          {
                            product?.attributes?.find(
                              ({ name }) => name === 'measurements',
                            )?.value
                          }
                        </T8y>
                      </div>
                    </div>
                  )}
                  {product?.attributes?.some(
                    ({ name }) => name === 'guide',
                  ) && <Guides product={product} />}
                </div>
              </div>
            </div>
          </div>
          <div className="col col-lg-6 col-xl-7 pl-0 pr-0 pl-lg-3 pr-lg-3 order-lg-1">
            <Gallery product={product} loading={loading} />
            <div
              className={clsx(
                'd-flex d-lg-none pl-4 pr-4 flex-column flex-sm-row',
                style.tableAndInfo,
              )}
            >
              <PriceTable price={Number(product?.price)} />
              <div
                className={clsx(
                  'ml-0 mt-3 ml-sm-4 mt-sm-0',
                  style.mainInfoBlock,
                )}
              >
                {product?.attributes?.some(
                  ({ name }) => name === 'measurements',
                ) && (
                  <div className={clsx('d-flex', style.size)}>
                    <Size />
                    <div className={style.sizeItem}>
                      <T8y variant="t3" bold>
                        Dimensions of the unit
                      </T8y>
                      <T8y variant="t3" className={style.sizeTxt}>
                        {
                          product?.attributes?.find(
                            ({ name }) => name === 'measurements',
                          )?.value
                        }
                      </T8y>
                    </div>
                  </div>
                )}
                {product?.attributes?.some(({ name }) => name === 'guide') && (
                  <Guides product={product} />
                )}
              </div>
            </div>
          </div>
        </div>
        <Variations slug={product.slug} />
        <Anchors name={product.name} />
        <HiredTogetherProducts anchor="together" slug={product.slug} />
        <div className="d-none d-lg-block">
          <Text product={product} />
          <RecentlyViewedProducts anchor="viewed" slug={product.slug} />
        </div>
        <div className="mt-5 d-flex flex-column d-lg-none">
          <TabList {...tab} as={Row} aria-label="My tabs">
            <Tab {...tab} as={Button} className={style.tabButton} stopId="tab1">
              Full Description
            </Tab>
            <Tab {...tab} as={Button} className={style.tabButton} stopId="tab2">
              FAQ
            </Tab>
            <Tab {...tab} as={Button} className={style.tabButton} stopId="tab3">
              Reviews
            </Tab>
          </TabList>
          <TabPanel {...tab} stopId="tab1">
            <div className="pt-5">
              <T8y variant="h1" color="primary">
                {product?.name} full description
              </T8y>
              <T8y variant="t1" as="p">
                {product.description}
              </T8y>
            </div>
          </TabPanel>
          <TabPanel {...tab} stopId="tab2">
            <div className="pt-5">
              {product?.faqs?.map(({ question, answer }) => (
                <Faq key={question} question={question} answer={answer} />
              ))}
              <Button
                as="a"
                href="https://help.easyeventhireuk.com/en/"
                className={style.faqButton}
                inverse
              >
                Go to general FAQ
              </Button>
            </div>
          </TabPanel>
          <TabPanel {...tab} stopId="tab3">
            <div className="pt-5">
              {product?.reviews?.map(({ name, rating, message, added_on }) => (
                <Comment
                  key={added_on}
                  name={name}
                  rating={rating}
                  date={getFormatedDayString(added_on)}
                  text={message}
                />
              ))}
            </div>
          </TabPanel>
        </div>
      </div>
      <RightMenu />
    </Row>
  );
}

function Gallery({ product, loading }) {
  const [currImg, setcurrImg] = React.useState('');

  React.useEffect(() => {
    setcurrImg(product.gallery?.[0]?.src);
  }, [loading, product.gallery]);

  if (loading) return <Spinner />;

  return (
    <div className="d-flex flex-column pt-5 pt-lg-0">
      <div className={clsx('mb-4', style.galleryMain)}>
        <img src={currImg} alt={product?.name} />
      </div>
      <div className={style.gallery}>
        {product.gallery.length > 1 && (
          <Slider slidesToShow={3} variableWidth>
            {product.gallery.map(({ src }) => (
              <div className={style.product} key={src}>
                <img
                  src={src}
                  alt={product?.name}
                  onClick={() => setcurrImg(src)}
                />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
}
function Anchors({ name }) {
  return (
    <div className={style.anchorWrap}>
      <T8y variant="h2">Table of contents:</T8y>
      <Row className={style.anchorRow}>
        {anchors.map(({ txt, anchor }) => (
          <T8y
            key={anchor}
            as="a"
            href={anchor}
            asLink
            variant="t1"
            color="primary"
            className={style.anchor}
          >
            {txt(name)}
          </T8y>
        ))}
      </Row>
    </div>
  );
}
function Guides({ product }) {
  return (
    <div className={clsx('d-flex', style.guid)}>
      <Guid />
      <div className={style.guidItem}>
        <T8y variant="t3" bold>
          User guides
        </T8y>
        {product?.attributes
          ?.filter(({ name }) => name === 'guide')
          .map((attribute, i) => (
            <T8y
              key={attribute?.src}
              variant="t2"
              href={attribute?.src}
              target="_blank"
              title={attribute?.value}
              as="a"
              className={style.guidLine}
              asLink
            >
              userguide{i === 0 ? '' : '-' + (i + 1)}.pdf
            </T8y>
          ))}
      </div>
    </div>
  );
}
const anchors = [
  {
    anchor: '#top',
    txt(name) {
      return `${name} Hire`;
    },
  },
  {
    anchor: '#together',
    txt() {
      return 'Frequently hired together';
    },
  },
  {
    anchor: '#desc',
    txt(name) {
      return `${name} Full Description`;
    },
  },
  {
    anchor: '#reviews',
    txt(name) {
      return `${name} Full Review`;
    },
  },
  {
    anchor: '#faq',
    txt(name) {
      return `${name} FAQ`;
    },
  },
  {
    anchor: '#viewed',
    txt() {
      return 'Recently viewed by others';
    },
  },
];
function Variations({ slug }) {
  const [variations, setvariations] = React.useState([]);
  React.useEffect(() => {
    if (slug) {
      PRODUCTS.getProductVariations(slug)
        .then(({ data }) => setvariations(data.data))
        .catch(_ => setvariations([]));
    }
  }, [slug]);

  if (!variations.length) return null;

  return (
    <Row className={style.variationRow}>
      <T8y variant="h2" className={style.variationTitle}>
        Variations
      </T8y>
      <Row className={style.variationWrap}>
        {variations.map(item => (
          <VariationsItem key={item.id} {...item} />
        ))}
      </Row>
    </Row>
  );
}
function VariationsItem({
  name,
  price,
  priceNumber = Number(price),
  image,
  slug,
}) {
  return (
    <Row
      as={Link}
      to={PATHS.PRODUCT(slug)}
      align="center"
      className={style.variation}
      noWrap
    >
      <img src={image} alt="" />
      <T8y variant="t2">
        {name}, £{priceNumber ? priceNumber.toFixed(2) : '0.00'}
      </T8y>
    </Row>
  );
}
function Text({ product }) {
  const typical = product?.attributes
    ?.filter(({ name }) => name === 'typical use')
    ?.map(({ value }) => value);
  const isThereTypicalSum = Boolean(typical.length);

  return (
    <div className={clsx('row flex-column flex-lg-row', style.about)}>
      <div className="col col-lg-6" id="desc">
        <T8y variant="h1" color="primary">
          {product?.name} full description
        </T8y>
        <T8y variant="t1" as="p">
          {product.description}
        </T8y>
        <br />
        {isThereTypicalSum && (
          <>
            <T8y variant="t1" as="p" bold>
              Typical uses
            </T8y>
            <T8y variant="t1" as="p">
              {typical.join(', ')}
            </T8y>
          </>
        )}
      </div>

      <div className="col col-lg-6" id="reviews">
        <T8y variant="h1" color="primary">
          {product?.name} reviews
        </T8y>
        <Row
          justify="stretch"
          align="center"
          inline
          className={style.commentTitle}
        >
          <T8y variant="t1">{product?.rating}</T8y>
          <Rating
            rating={product?.rating}
            className={style.commentStars}
            size={23}
          />
          <T8y variant="t2">reviewed {product?.reviews?.length} times</T8y>
        </Row>
        {product?.reviews?.map(({ name, rating, message, added_on }) => (
          <Comment
            key={added_on}
            name={name}
            rating={rating}
            date={getFormatedDayString(added_on)}
            text={message}
          />
        ))}

        <T8y variant="h1" color="primary" id="faq">
          {product.name} FAQ
        </T8y>
        {product?.faqs?.map(({ question, answer }) => (
          <Faq key={question} question={question} answer={answer} />
        ))}
        <Button
          as="a"
          href="https://help.easyeventhireuk.com/en/"
          className={style.faqButton}
          inverse
        >
          Go to general FAQ
        </Button>
      </div>
    </div>
  );
}
function PriceTable({ price = 0 }) {
  return (
    <table className={style.pricing}>
      <tbody>
        <tr>
          <T8y variant="t2" as="th">
            Hire time
          </T8y>
          <T8y variant="t2" as="th">
            Price
          </T8y>
        </tr>
        <tr>
          <T8y as="td" variant="t2">
            1-7 days
          </T8y>
          <T8y as="td" variant="t2">
            £{parseFloat(price).toFixed(2)}
          </T8y>
        </tr>
        <tr>
          <T8y as="td" variant="t2">
            8-14 days
          </T8y>
          <T8y as="td" variant="t2">
            £{parseFloat(price * 2).toFixed(2)}
          </T8y>
        </tr>
        <tr>
          <T8y as="td" variant="t2">
            Additional <br />7 days, each
          </T8y>
          <T8y as="td" variant="t2">
            £{parseFloat(price).toFixed(2)}
          </T8y>
        </tr>
      </tbody>
    </table>
  );
}
function ButtonPanel({ product, setselectingDetails, setaddingProcess }) {
  const weeks = useStore(weeksOrder$);

  const productInCart = useStoreMap({
    store: cart$,
    keys: [product.id],
    fn: (cart, [productId]) => cart.find(({ id }) => id === productId) || null,
  });
  const [count, setcount] = React.useState(1);

  const isInCart = Boolean(productInCart);

  React.useEffect(() => {
    setselectingDetails({ product, id: product.id, count });
  }, [count, product, setselectingDetails]);

  // reset count on product change
  React.useEffect(() => {
    setcount(1);
  }, [product]);

  return (
    <div className={clsx('d-flex flex-wrap', style.buttonPanel)}>
      <div className="mr-3 d-flex flex-column">
        <T8y variant="smllText" bold>
          For your dates
        </T8y>
        {!weeks ? (
          <DatePickerDisclosure>
            <T8y variant="t2" color="primary" asLink>
              Select dates first
            </T8y>
          </DatePickerDisclosure>
        ) : (
          <T8y variant="h1" color="primary">
            £
            {(
              (Number(product?.price) *
                100 *
                (isInCart ? productInCart.count : count) *
                weeks) /
              100
            ).toFixed(2)}
          </T8y>
        )}
      </div>
      <div className="d-flex">
        <div className={clsx(style.counterWrap, 'd-flex- mr-3')}>
          {isInCart ? (
            <QuantityChanger
              startCount={productInCart.count}
              changeCount={e => {
                editItemInCart({ ...productInCart, count: e });
              }}
            />
          ) : (
            <QuantityChanger startCount={count} changeCount={setcount} />
          )}
        </div>
        {isInCart ? (
          <Button prefixIcon={<Checked />} dark>
            Added to Quote
          </Button>
        ) : (
          <Button
            prefixIcon={<Basket />}
            disabled={!weeks}
            onClick={() => {
              window.scrollTo({ top: 0 });
              const productObj = {
                product,
                id: product.id,
                count,
              };
              const returnDirty = product?.attributes?.some(
                ({ name, value }) =>
                  name === 'return dirty' && value?.toLowerCase() === 'y',
              );
              if (returnDirty) productObj.returnDirty = true;
              setselectingDetails(productObj);
              setaddingProcess('step1');
            }}
          >
            Add to Quote
          </Button>
        )}
      </div>
    </div>
  );
}
function BreadCrumbs({ name, sub }) {
  return (
    <>
      <Row align="center" className={clsx('nav-links', style.breadcrumbs)}>
        <T8y as={Link} to="/products" variant="t2">
          All products
        </T8y>
        {sub && (
          <>
            <T8y variant="t1" className={style.arrow}>
              →
            </T8y>
            <T8y as={Link} to={PATHS.CATEGORY(sub?.slug)} variant="t2">
              {sub?.name}
            </T8y>
            <T8y variant="t1" className={style.arrow}>
              →
            </T8y>
          </>
        )}
      </Row>
      <T8y variant="h1" as="h1" color="primary">
        {name}
      </T8y>
    </>
  );
}
function Desc({ attributes }) {
  const allFeatures = attributes?.filter(({ name }) => name === 'feature');
  const power = attributes?.find(({ name }) => name === 'power');
  const output = attributes?.find(({ name }) => name === 'output');
  const capacity = attributes?.find(({ name }) => name.startsWith('capacity'));

  return (
    <ul className={style.desc}>
      {allFeatures?.map(({ value }) => (
        <T8y key={value} as="li" variant="t1">
          {value}
        </T8y>
      ))}
      {power && (
        <T8y as="li" variant="t1">
          {power.name}: {power.value}
        </T8y>
      )}
      {output && (
        <T8y as="li" variant="t1">
          {output.name}: {output.value}
        </T8y>
      )}
      {capacity && (
        <T8y as="li" variant="t1">
          {capacity.name}: {capacity.value}
        </T8y>
      )}
    </ul>
  );
}
function Comment({ name, rating, date, text }) {
  return (
    <div className={style.comment}>
      <Row align="center" className={style.commentInfo}>
        <T8y variant="t3" bold>
          {name}
        </T8y>
        <Rating rating={rating} className={style.commentStars} />
        <T8y variant="t3" className={style.commentDate}>
          {date}
        </T8y>
      </Row>
      <T8y variant="t2" className={style.commentText}>
        {text}
      </T8y>
    </div>
  );
}
function Faq({ question, answer, visible = false }) {
  const disclosure = useDisclosureState({ visible });
  return (
    <div
      className={clsx(style.faq, {
        [style.active]: disclosure.visible,
      })}
    >
      <Disclosure
        as={T8y}
        variant="t3"
        bold
        color={disclosure.visible ? 'primary' : 'secondary'}
        className={clsx(style.faqQestion, {
          [style.active]: disclosure.visible,
        })}
        {...disclosure}
      >
        {question}
        {disclosure.visible && <Subtract />}
      </Disclosure>
      <DisclosureContent {...disclosure}>
        {() => disclosure.visible && <T8y variant="t2">{answer}</T8y>}
      </DisclosureContent>
    </div>
  );
}

function getFormatedDayString(date = '2020-01-01') {
  const fullDate = Date.parse(date.substring(0, 10));
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(fullDate);
}

function useTotalData() {
  const { startDate, endDate } = useStore(picker_state$);
  const postcode = useStore(postcode$);
  const cart = useStore(cart$);
  const sessionId = useStore(sessionId$);
  const weeks = useStore(weeksOrder$);
  const [data, setdata] = React.useState({});

  React.useEffect(() => {
    if (weeks) {
      CART.getTotalPrice({
        session_id: sessionId,
        start_date: startDate,
        end_date: endDate,
        postcode,
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
      }).then(({ data }) => {
        setdata(data.data);
      });
    }
  }, [cart, weeks, postcode, sessionId, startDate, endDate]);

  return data;
}

function TotalPrice() {
  const data = useTotalData();

  return (
    <div className="d-flex pt-2">
      <T8y variant="t1">Quote total: &nbsp;</T8y>
      {data?.total && (
        <T8y variant="t1" bold>
          £{data?.total?.toFixed(2)}
        </T8y>
      )}
    </div>
  );
}
