import React from 'react';
import { styled } from 'linaria/react';

import { ColorPanel } from 'features/filter';

import { Rating } from '../../ui/Rating';
import { Button, Cell, Field, Grid, inputStyle, Row, Select, T8y } from 'ui';

import { ReactComponent as Archive } from '../../assets/images/icon/archive.svg';
import { ReactComponent as Edit } from '../../assets/images/icon/edit.svg';
import { ReactComponent as Eye } from '../../assets/images/icon/eye.svg';
import { ReactComponent as Plus } from '../../assets/images/icon/plus.svg';
import { ReactComponent as ProductIcon } from '../../assets/images/icon/product.svg';
import { ReactComponent as Upload } from '../../assets/images/icon/upload.svg';

const DragDrop = () => {
  return (
    <DragDropStyle as={Row} direction="column" justify="center" align="center">
      <Upload />
      <T8y variant="t3">Drag File here or choose from your computer</T8y>
    </DragDropStyle>
  );
};
export const More = ({ marginTop }) => {
  return (
    <T8y asLink color="primary">
      <Row align="center" inline as={marginTop ? MorePosition : 'div'}>
        <IconStyle as={Plus} />
        Add more
      </Row>
    </T8y>
  );
};
export const RowInfo = ({ loading }) => {
  return (
    <Grid as={rowInfo} gaps="1rem 3rem" cols="4fr 1fr 1fr 1fr" places="center">
      <Cell place="center start" as={T8y} variant="h1">
        {loading ? 'Creating...' : 'Create a new product'}
      </Cell>

      <Row align="center" justify="stretch">
        <IconStyle as={Archive} />
        <T8y bold>All Archived</T8y>
      </Row>

      <ButtonCellStyle
        place="center end"
        as={Button}
        prefixIcon={<Eye />}
        inverse
      >
        Save and View
      </ButtonCellStyle>

      <ButtonCellStyle place="center end" as={Button} type="submit">
        Create Product
      </ButtonCellStyle>
    </Grid>
  );
};

export const Variations = () => {
  return (
    <>
      <T8y as={title} variant="h2">
        Variations
      </T8y>
      <VariationsStyle as={Row} align="center">
        <Icon as={Edit} />
        <T8y color="primary">Create a variation of an existing product</T8y>
      </VariationsStyle>
    </>
  );
};

export const UploadPhotos = () => {
  return (
    <>
      <T8y as={title} variant="h2">
        Upload photos{' '}
      </T8y>
      <Grid
        as={Block}
        marginBottom
        gaps="2rem 2rem"
        rows="10rem 6rem 6rem"
        cols="repeat(4, 1fr)"
        places="center"
      >
        <Cell as={CellUpload} area="auto / span 4">
          <DragDrop />
        </Cell>
        <Cell as={CellUpload}></Cell>
        <Cell as={CellUpload}></Cell>
        <Cell as={CellUpload}></Cell>
        <Cell as={CellUpload}></Cell>
        <Cell as={CellUpload}></Cell>
        <Cell as={CellUpload}></Cell>
        <Cell as={CellUpload}></Cell>
        <Cell as={CellUpload}></Cell>
      </Grid>
    </>
  );
};

export const UploadGuides = () => {
  return (
    <>
      <T8y as={title} variant="h2">
        Upload user guides
      </T8y>

      <Row as={Block}>
        <CellUploadHigh>
          <DragDrop />
        </CellUploadHigh>
      </Row>
    </>
  );
};

export const Specifications = () => {
  return (
    <>
      <T8y as={title} variant="h2">
        Specifications
      </T8y>
      <Grid
        as={Block}
        marginTop
        marginBottom
        gaps="2rem 2rem"
        cols="1fr 1fr 2fr"
        places="center start"
      >
        <Cell as={Full}>
          <Field legend="Measurements">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>
        </Cell>

        <Cell as={Full}>
          <Field legend="Capacity (CL)">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>
        </Cell>

        <Cell as={Full}>
          <Field legend="Rating" noBorder>
            <ColorPanel />
          </Field>
        </Cell>

        <Cell as={Full}>
          <Field legend="Output">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>
        </Cell>

        <Cell as={Full}>
          <Field legend="Capacity (ML)">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>
        </Cell>

        <Cell as={Full} place="start" area="span 3 / auto">
          <Field legend="Notes">
            <textarea
              name="Notes"
              rows="10"
              className={inputStyle}
              placeholder="Notes"
            />
          </Field>
        </Cell>

        <Cell as={Full}>
          <Field legend="Power">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>
        </Cell>

        <Cell as={Full}>
          <Field legend="Capacity (LTR)">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>
        </Cell>

        <Cell as={Full}>
          <Field legend="Capacity (OZ)">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>
        </Cell>

        <Cell as={Full}>
          <Field legend="Capacity (CU FT)">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>
        </Cell>
      </Grid>
    </>
  );
};

export const EventTypes = () => {
  const select = () => {};

  return (
    <>
      <T8y as={title} variant="h2">
        Event Types
      </T8y>

      <Grid
        as={Full}
        marginTop
        marginBottom
        gaps="0 2rem"
        cols="1fr 4fr"
        places="center start"
      >
        <Cell as={Block}>
          <FieldStyle as={Field} legend="Event size">
            <Select
              options={[
                { name: 'Furniture', slug: 'f' },
                { name: 'Furniture2', slug: 'f2' },
                { name: 'Furniture3', slug: 'f3' },
              ]}
              selected={'Furniture'}
              defaultText="Select size"
              aLabel="Package"
              onClickOption={select}
              className={inputStyle}
            />
          </FieldStyle>
        </Cell>

        <Grid
          as={Block}
          gaps="0 2rem"
          cols="repeat(4, 2fr) 1fr"
          places="center start"
        >
          <Cell as={Full}>
            <FieldStyle as={Field} legend="Event size">
              <Select
                options={[
                  { name: 'Furniture', slug: 'f' },
                  { name: 'Furniture2', slug: 'f2' },
                  { name: 'Furniture3', slug: 'f3' },
                ]}
                selected={'Furniture'}
                defaultText="Select size"
                aLabel="Package"
                onClickOption={select}
                className={inputStyle}
              />
            </FieldStyle>
          </Cell>

          <Cell as={Full}>
            <FieldStyle as={Field} legend="Event size">
              <Select
                options={[
                  { name: 'Furniture', slug: 'f' },
                  { name: 'Furniture2', slug: 'f2' },
                  { name: 'Furniture3', slug: 'f3' },
                ]}
                selected={'Furniture'}
                defaultText="Select size"
                aLabel="Package"
                onClickOption={select}
                className={inputStyle}
              />
            </FieldStyle>
          </Cell>

          <Cell as={Full}>
            <FieldStyle as={Field} legend="Event size">
              <Select
                options={[
                  { name: 'Furniture', slug: 'f' },
                  { name: 'Furniture2', slug: 'f2' },
                  { name: 'Furniture3', slug: 'f3' },
                ]}
                selected={'Furniture'}
                defaultText="Select size"
                aLabel="Package"
                onClickOption={select}
                className={inputStyle}
              />
            </FieldStyle>
          </Cell>

          <Cell as={Full}>
            <FieldStyle as={Field} legend="Event size">
              <Select
                options={[
                  { name: 'Furniture', slug: 'f' },
                  { name: 'Furniture2', slug: 'f2' },
                  { name: 'Furniture3', slug: 'f3' },
                ]}
                selected={'Furniture'}
                defaultText="Select size"
                aLabel="Package"
                onClickOption={select}
                className={inputStyle}
              />
            </FieldStyle>
          </Cell>

          <Cell place="center start">
            <More marginTop />
          </Cell>
        </Grid>
      </Grid>
    </>
  );
};

export const Faq = () => {
  return (
    <>
      <T8y as={title} variant="h2">
        FAQ
      </T8y>

      <Grid as={Full} marginBottom gaps="2rem 2rem" cols="repeat(3, 1fr)">
        <Cell as={Block}>
          <Field legend="Question">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>

          <MarginTop as={Field} legend="Answer">
            <textarea
              name="Answer"
              rows="4"
              className={inputStyle}
              placeholder="Answer"
            />
          </MarginTop>
        </Cell>
        <Cell as={Block}>
          <Field legend="Question">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>

          <MarginTop as={Field} legend="Answer">
            <textarea
              name="Answer"
              rows="4"
              className={inputStyle}
              placeholder="Answer"
            />
          </MarginTop>
        </Cell>
        <Cell as={Block}>
          <Field legend="Question">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>

          <MarginTop as={Field} legend="Answer">
            <textarea
              name="Answer"
              rows="4"
              className={inputStyle}
              placeholder="Answer"
            />
          </MarginTop>
        </Cell>
        <Cell as={Block}>
          <Field legend="Question">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>

          <MarginTop as={Field} legend="Answer">
            <textarea
              name="Answer"
              rows="4"
              className={inputStyle}
              placeholder="Answer"
            />
          </MarginTop>
        </Cell>
        <Cell as={Block}>
          <Field legend="Question">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>

          <MarginTop as={Field} legend="Answer">
            <textarea
              name="Answer"
              rows="4"
              className={inputStyle}
              placeholder="Answer"
            />
          </MarginTop>
        </Cell>
      </Grid>

      <Row justify="center">
        <More />
      </Row>
    </>
  );
};

export const Review = () => {
  return (
    <>
      <T8y as={title} variant="h2">
        Review
      </T8y>

      <Grid as={Full} marginBottom gaps="2rem 2rem" cols="repeat(3, 1fr)">
        <Cell as={Block}>
          <Field legend="Name">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>

          <MarginTop as={Grid} cols="1fr 1fr" gaps="0 2rem">
            <Field legend="Name">
              <input name="name" type="text" className={inputStyle} value={1} />
            </Field>
            <Cell place="center">
              <Field legend="Rating" noBorder>
                <Rating stars={3} />
              </Field>
            </Cell>
          </MarginTop>

          <MarginTop as={Field} legend="Review">
            <textarea
              name="Answer"
              rows="4"
              className={inputStyle}
              placeholder="Answer"
            />
          </MarginTop>
        </Cell>

        <Cell as={Block}>
          <Field legend="Name">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>

          <MarginTop as={Grid} cols="1fr 1fr" gaps="0 2rem">
            <Field legend="Name">
              <input name="name" type="text" className={inputStyle} value={1} />
            </Field>
            <Cell place="center">
              <Field legend="Rating" noBorder>
                <Rating stars={3} />
              </Field>
            </Cell>
          </MarginTop>

          <MarginTop as={Field} legend="Review">
            <textarea
              name="Answer"
              rows="4"
              className={inputStyle}
              placeholder="Answer"
            />
          </MarginTop>
        </Cell>

        <Cell as={Block}>
          <Field legend="Name">
            <input name="name" type="text" className={inputStyle} value={1} />
          </Field>

          <MarginTop as={Grid} cols="1fr 1fr" gaps="0 2rem">
            <Field legend="Name">
              <input name="name" type="text" className={inputStyle} value={1} />
            </Field>
            <Cell place="center">
              <Field legend="Rating" noBorder>
                <Rating stars={3} />
              </Field>
            </Cell>
          </MarginTop>

          <MarginTop as={Field} legend="Review">
            <textarea
              name="Answer"
              rows="4"
              className={inputStyle}
              placeholder="Answer"
            />
          </MarginTop>
        </Cell>
      </Grid>

      <Row justify="center">
        <More />
      </Row>
    </>
  );
};

export const Together = () => {
  return (
    <>
      <T8y as={title} variant="h2">
        Frequently Hired Together
      </T8y>
      <Row as={Block} align="center" marginBottom>
        <Icon as={ProductIcon} />
        <T8y>No required extra...</T8y>
      </Row>
    </>
  );
};

export const Extra = () => {
  return (
    <>
      <Grid cols="1fr 1fr" gaps="0 2rem">
        <T8y as={title} variant="h2">
          Required Extra
        </T8y>
        <T8y as={title} variant="h2">
          Optional Extra
        </T8y>
      </Grid>

      <Grid cols="1fr 1fr" gaps="0 2rem">
        <Cell as={Block}>
          <Row align="center">
            <Icon as={ProductIcon} />
            <T8y>No required extra...</T8y>
          </Row>
        </Cell>

        <Cell as={Block}>
          <Row align="center">
            <Icon as={ProductIcon} />
            <T8y>No optional extra...</T8y>
          </Row>
        </Cell>
      </Grid>
    </>
  );
};

export const Buttons = () => {
  return (
    <BlockButtonStyle as={Row} justify="end">
      <ButtonCustomStyle as={Button} prefixIcon={<Eye />} inverse>
        Save and View
      </ButtonCustomStyle>

      <ButtonCustomStyle as={Button} type="submit">
        Create Product
      </ButtonCustomStyle>
    </BlockButtonStyle>
  );
};

const VariationsStyle = styled.div`
  margin-bottom: 4rem;
  padding: 4rem 2rem;
  background: #fff;
`;

const Icon = styled.svg`
  margin-right: 1rem;
`;

const ButtonCellStyle = styled.button`
  width: 100%;
  font-size: 1.6rem;
  border-radius: 0.7rem;
`;

const ButtonCustomStyle = styled.button`
  width: 20rem;
  margin-left: 3rem;
  font-size: 1.6rem;
  border-radius: 0.7rem;
`;

const title = styled.h2`
  margin-bottom: 2rem;
`;

const Block = styled.div`
  width: 100%;
  margin-top: ${props => (props.marginTop ? '2rem' : 0)};
  margin-bottom: ${props => (props.marginBottom ? '3rem' : 0)};
  padding: 2rem 2rem;
  background: #fff;
`;

const CellUpload = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid #e4e8ed;
`;

const CellUploadHigh = styled.div`
  width: 100%;
  height: 14rem;
  border: 1px solid #e4e8ed;
`;

const FieldStyle = styled.div`
  width: 100%;
`;

const MarginTop = styled.div`
  margin-top: 1rem;
`;

const BlockButtonStyle = styled.div`
  margin-top: 3rem;
`;

const Full = styled.div`
  width: 100%;
  margin-top: ${props => (props.marginTop ? '2rem' : 0)};
  margin-bottom: ${props => (props.marginBottom ? '3rem' : 0)};
`;

const IconStyle = styled.div`
  margin-right: 1rem;
`;

const rowInfo = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid #e4e8ed;
`;

const DragDropStyle = styled.div`
  height: 100%;
`;
const MorePosition = styled.div`
  margin-top: 3rem;
`;
