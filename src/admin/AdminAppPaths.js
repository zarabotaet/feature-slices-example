export const PATHS = Object.freeze({
  ROOT: '/admin',
  _PRODUCTS: 'products',
  _PRODUCT: 'product',

  get PRODUCTS() {
    return `${this.ROOT}/${this._PRODUCTS}`;
  },
  PRODUCT(id) {
    return `${this.ROOT}/${this._PRODUCT}/${id}`;
  },
});
