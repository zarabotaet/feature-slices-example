export {
  PopularProducts,
  RecentlyViewedProducts,
  HiredTogetherProducts,
} from './PopularProducts/PopularProducts';
export { RightMenu } from './RightMenu/RightMenu';
export { HeaderProducts } from './HeaderProducts/HeaderProducts';

export {
  categories$,
  getAllCategoriesFx,
  allProducts$,
  allProductsLoading$,
  categoryGate,
  productsGate,
  currentCategory$,
  currentSubCategories$,
  productsByCategoryLoading$,
  productsByCategory$,
  checkSubCategory,
  productsTotalPages$,
} from './productsModel';
