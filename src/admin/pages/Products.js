import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Menu,
  MenuButton,
  MenuItem,
  useDialogState,
  useMenuState,
} from 'reakit';
import { PATHS } from 'admin/AdminAppPaths';
import { useGate, useList, useStore } from 'effector-react';
import { styled } from 'linaria/react';
import { transparentize } from 'polished';

import { PRODUCTS } from 'admin/api';

import {
  cancelTouchProduct,
  deleteProduct,
  filteredProducts$,
  productsGate,
  serchPending$,
  showProducts$,
  showProductsChanged,
  showProductsQuantity$,
  touchProduct,
  updateProductWithTouched,
} from './model';

import { colors, fontSizes } from 'admin/styleGuide';
import { Icon, IconWrapper, T8y } from 'admin/ui';
import {
  Button,
  Cell,
  Checkbox,
  Field,
  Grid,
  inputStyle,
  Modal,
  Row,
} from 'ui';

import { ReactComponent as Archive } from '../assets/icons/archive.svg';
import { ReactComponent as Cart } from '../assets/icons/cart.svg';
import { ReactComponent as CheckBox } from '../assets/icons/checkBox.svg';
import { ReactComponent as Cross } from '../assets/icons/cross.svg';
import { ReactComponent as Delete } from '../assets/icons/delete.svg';
import { ReactComponent as Edit } from '../assets/icons/edit.svg';
import { ReactComponent as FilterIcon } from '../assets/icons/filter.svg';
import { ReactComponent as Save } from '../assets/icons/save.svg';
import { ReactComponent as SortIcon } from '../assets/icons/sort.svg';

export const Products = () => {
  useGate(productsGate);
  const products = useStore(filteredProducts$);
  const serchPending = useStore(serchPending$);

  return (
    <>
      <Grid
        gaps="1rem 0"
        cols="2fr repeat(4, 1fr)"
        places="center"
        as={RowInfoStyled}
      >
        <Cell place="center start" as={T8y} color="darkBlue" variant="t1" bold>
          {serchPending ? 'Searching...' : `${products.length} Products Found`}
        </Cell>
        <Sort />
        <Filter />
        <Row align="center" justify="stretch" as={IconWrapper}>
          <Archive />

          <T8y color="darkBlue">All Archived</T8y>
        </Row>
        <Cell place="center stretch">
          <Button
            as={Link}
            to={PATHS.PRODUCT('new')}
            prefixIcon={<Icon as={Cart} light />}
          >
            Add new
          </Button>
        </Cell>
      </Grid>

      <Grid cols="1fr repeat(5, 5fr) 4fr" rows="8rem" places="center">
        <CheckBox />
        <T8y color="gray">Product Code</T8y>
        <T8y color="gray">Photo</T8y>
        <T8y color="gray">Name</T8y>
        <T8y color="gray">Price</T8y>
        <T8y color="gray">Max quantity</T8y>
        <T8y color="gray">Navigation</T8y>
      </Grid>
      <Grid gaps="1rem 0">
        <ProductsList />
      </Grid>
    </>
  );
};

const ProductsList = () => useList(showProducts$, e => <Product {...e} />);

const Product = React.memo(
  ({ price, image, name, sku, slug, id, touched, quantity, category_id }) => (
    <Grid
      rows="9rem"
      cols="1fr repeat(5, 5fr) repeat(2, 2fr)"
      cols_md="1fr 1fr 1fr"
      rows_md="1fr 1fr"
      places="center"
      as={RowStyled}
    >
      <Checkbox checked={true} />
      <T8y>{sku}</T8y>
      <img src={image} loading="lazy" height="55" alt="" />
      <Cell as={T8y} area_md="1 / 1 / 2 / 4">
        {name}
      </Cell>
      <Field>
        <InputOverrides
          as="input"
          name="name"
          type="number"
          className={inputStyle}
          value={touched ? touched?.price : price}
          onChange={e =>
            touchProduct({
              price: e.target.value,
              id,
              sku,
              category_id,
              display_name: name,
            })
          }
        />
      </Field>
      <Field>
        <InputOverrides
          as="input"
          name="name"
          type="number"
          placeholder="Max quantity"
          value={touched ? touched?.quantity : quantity}
          onChange={e =>
            touchProduct({
              quantity: e.target.value,
              price,
              id,
              sku,
              category_id,
              display_name: name,
            })
          }
          className={inputStyle}
        />
      </Field>
      {touched ? (
        <>
          <SaveProductBtn id={id} />
          <CancelProductBtn id={id} />
        </>
      ) : (
        <>
          <EditProductBtn id={id} />
          <DeleteProductBtn {...{ name, sku, slug, id }} />
        </>
      )}
    </Grid>
  ),
);

const EditProductBtn = ({ id }) => {
  return (
    <ProductBtnStyled>
      <IconWrapper
        as={Grid}
        gaps="1rem"
        cols="auto 1fr"
        rows="5rem"
        places="center"
      >
        <Edit />
        <T8y color="primary">Edit</T8y>
      </IconWrapper>
    </ProductBtnStyled>
  );
};

const SaveProductBtn = ({ id }) => {
  return (
    <ProductBtnStyled onClick={() => updateProductWithTouched(id)}>
      <IconWrapper
        as={Grid}
        gaps="1rem"
        cols="auto 1fr"
        rows="5rem"
        places="center"
      >
        <Save />
        <T8y color="primary">Save</T8y>
      </IconWrapper>
    </ProductBtnStyled>
  );
};

const CancelProductBtn = ({ id }) => {
  return (
    <ProductBtnStyled onClick={() => cancelTouchProduct({ id })}>
      <IconWrapper
        dark
        as={Grid}
        gaps="1rem"
        cols="auto 1fr"
        rows="5rem"
        places="center"
      >
        <Cross />
        <T8y color="gray">Cancel</T8y>
      </IconWrapper>
    </ProductBtnStyled>
  );
};

const DeleteProductBtn = ({ name, sku, id }) => {
  const dialog = useDialogState();

  const deleteItem = async () => {
    try {
      await PRODUCTS.delete(id);
      toast(`Product ${name} was deleted`);
      deleteProduct(id);
    } catch {
      toast.error(`Product ${name} wasn't deleted`);
    } finally {
      dialog.hide();
    }
  };

  const disclosure = (
    <ProductBtnStyled>
      <IconWrapper
        dark
        as={Grid}
        gaps="1rem"
        cols="auto 1fr"
        rows="5rem"
        places="center"
      >
        <Delete />
        <T8y color="gray">Delete</T8y>
      </IconWrapper>
    </ProductBtnStyled>
  );

  return (
    <Modal
      disclosure={disclosure}
      title="Confirm deleting"
      dialogState={dialog}
      width={360}
      lazyRender
    >
      <Grid gaps="2rem 0">
        <T8y variant="t2" color="darkBlue">
          Are you shure to delete product {name} with sku {sku} ?
        </T8y>
        <Row justify="space">
          <Button small onClick={dialog.hide} inverse>
            Cancel
          </Button>
          <Button small onClick={deleteItem}>
            Delete
          </Button>
        </Row>
      </Grid>
    </Modal>
  );
};

const Sort = () => (
  <Grid cols="1rem 7rem 5rem 1rem" places="center">
    <Icon as={SortIcon} />

    <T8y color="gray">Sort by:</T8y>
    <T8y color="primary" bold>
      Price
    </T8y>
  </Grid>
);

const Filter = () => {
  const menu = useMenuState();

  const selectedShowProductsQuantity = useStore(showProductsQuantity$);
  const options = [
    { name: 'All', slug: null },
    { name: '100', slug: 100 },
    { name: '50', slug: 50 },
    { name: '10', slug: 10 },
  ];

  const displayName = options.find(
    ({ slug }) => slug === selectedShowProductsQuantity,
  ).name;

  return (
    <Grid cols="2rem 1fr 1fr 1rem" places="center">
      <Icon as={FilterIcon} />

      <T8y color="darkBlue" bold>
        Show:
      </T8y>

      <MenuButton {...menu}>
        <T8y color="primary" bold>
          {displayName}
        </T8y>
      </MenuButton>

      <Menu {...menu} as={OptionsStyled}>
        {options.map(({ name, slug }, i) => (
          <MenuItem
            {...menu}
            key={i}
            onClick={() => {
              showProductsChanged(slug);
              menu.hide();
            }}
            as={OptionStyled}
          >
            {name}
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  );
};

const RowInfoStyled = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid ${colors.gray};
`;

const RowStyled = styled.div`
  background: ${colors.positive};
  border-radius: 0.5rem;
  &:hover {
    margin-left: -0.5rem;
    border-left: 0.5rem solid ${colors.primary};
  }
`;

const OptionsStyled = styled.div`
  z-index: 1;
  box-sizing: content-box;
  background-color: ${colors.positive};
  border-top: none;
  box-shadow: 0px 0.5rem 2.5rem ${transparentize(0.8, colors.gray)};
`;
const OptionStyled = styled.div`
  display: block;
  width: 100%;
  padding: 0 1.2rem;
  font-size: ${fontSizes.t3};
  text-align: left;
  cursor: pointer;
`;
const ProductBtnStyled = styled.div`
  cursor: pointer;
`;
const InputOverrides = styled.div`
  text-indent: 1rem;
`;
