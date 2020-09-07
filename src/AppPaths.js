export const PATHS = Object.freeze({
  ROOT: '/',
  _PRODUCTS: 'products',
  _SEARCH: 'search',
  _PRODUCT: 'product',
  _ABOUT: 'about-us',
  _CART: 'cart',
  _CHECKOUT: 'checkout',
  _SUCCESS: 'success',
  _SUCCESS_PAY_LATER: 'success-pay-later',
  _DELIVERY_TIME_SELECT: 'time-select',
  _LOGIN: 'login',
  _ERROR: '404',
  _BLOG: 'blog',

  get PRODUCTS() {
    return `${this.ROOT}${this._PRODUCTS}`;
  },
  SEARCH(page = 1) {
    return `${this.ROOT}${this._SEARCH}/${page}`;
  },
  CATEGORY(slug, page = 1) {
    return `${this.PRODUCTS}/${slug}/${page}`;
  },
  PRODUCT(slug) {
    return `${this.ROOT}${slug}`;
  },
  get ABOUT() {
    return `${this.ROOT}${this._ABOUT}`;
  },
  get CART() {
    return `${this.ROOT}${this._CART}`;
  },
  CART_PROPS(orderId) {
    return `${this.ROOT}${this._CART}/${orderId}`;
  },
  get CHECKOUT() {
    return `${this.ROOT}${this._CHECKOUT}`;
  },
  get SUCCESS() {
    return `${this.ROOT}${this._SUCCESS}`;
  },
  get SUCCESS_PAY_LATER() {
    return `${this.ROOT}${this._SUCCESS_PAY_LATER}`;
  },
  DELIVERY_TIME_SELECT(type) {
    return `${this.ROOT}${this._DELIVERY_TIME_SELECT}/${type}`;
  },
  get LOGIN() {
    return `${this.ROOT}${this._LOGIN}`;
  },
  get ERROR() {
    return `${this.ROOT}${this._ERROR}`;
  },
  get BLOG() {
    return `${this.ROOT}${this._BLOG}`;
  },
});
