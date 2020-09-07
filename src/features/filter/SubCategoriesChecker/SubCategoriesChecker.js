import React from 'react';
import { Button } from 'reakit';
import { PATHS } from 'AppPaths';
import clsx from 'clsx';
import { useList } from 'effector-react';

import { checkSubCategory, currentSubCategories$ } from 'features/products';

import { Row, T8y } from 'ui';

// import { ReactComponent as Checked } from 'assets/images/icon/subcategory--checked.svg';
// import { ReactComponent as UnChecked } from 'assets/images/icon/subcategory--unchecked.svg';
import { active, item, label, txt } from './subCategoriesChecker.module.scss';

export function SubCategoriesChecker() {
  return (
    <div className="row">
      {useList(currentSubCategories$, ({ subCategoryItem, checked }) => (
        <SubCategory checked={checked} {...subCategoryItem}>
          {subCategoryItem.name}
        </SubCategory>
      ))}
    </div>
  );
}
function SubCategory({ children, checked, id, src, slug }) {
  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 my-3">
      <Button
        onClick={e => {
          e.preventDefault();
          checkSubCategory(id);
        }}
        className={clsx(item, { [active]: checked })}
        style={{ backgroundImage: `url(${src})` }}
        as="a"
        href={PATHS.CATEGORY(slug)}
      >
        <Row className={label} align="center">
          {/*{checked ? <Checked /> : <UnChecked />}*/}
          <T8y as="span" variant="t2" bold color="light" className={txt}>
            {children}
          </T8y>
        </Row>
      </Button>
    </div>
  );
}
