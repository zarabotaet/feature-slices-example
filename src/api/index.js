import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
});

export const AUTH = {
  login({ email, password }) {
    return instance.post(`auth/login`, {
      email,
      password,
    });
  },
  me() {
    return instance.post(`auth/me`);
  },
};

export const CATREGORIES = {
  getAll() {
    return instance.get(`categories`, { params: { all: 1 } });
  },
};
export const PRODUCTS = {
  getAll(params) {
    const { slug, ...restParams } = params;
    return instance.get(`category/${slug}`, { params: restParams });
  },
  getPopular(selectedPackage) {
    return instance.get(`popularProducts`, {
      params: {
        ...(selectedPackage !== 'All' && { package: selectedPackage }),
      },
    });
  },
  getRecentlyViewed(slug) {
    return instance.post(`products/${slug}/recentlyViewed`);
  },
  getHiredTogether(slug) {
    return instance.get(`products/${slug}/hiredTogether`);
  },
  getProduct(slug) {
    return instance.get(`products/${slug}`);
  },
  getProductVariations(slug) {
    return instance.get(`/products/${slug}/variations`);
  },
};
// export const IMPORT = {
//   importCategories(json) {
//     return instance.put(`admin/import/categories`, json, {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
//     });
//   },
//   importProducts(csv) {
//     return instance.put(`admin/import/products`, csv, {
//       headers: {
//         'Content-Type': 'text/csv',
//         Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
//       },
//     });
//   },
//   getImportStatus(id) {
//     return instance.get(`admin/import/status/${id}`);
//   },
// };
export const CART = {
  getTotalPrice(params) {
    return instance.post(`/totalPrice`, params);
  },
  getOrder(orderId) {
    return instance.get(`/orders/${orderId}`);
  },
  getPostcodePrice(postcode) {
    return instance.get(`/postcodePrice`, { params: { postcode } });
  },
};
export const SESSION = {
  newSession() {
    return instance.get(`/newSession`);
  },
};
export const CHECKOUT = {
  go(params) {
    return instance.post(`/checkout`, params);
  },
  generate(id) {
    return instance.get(`/payments/create-setup-intent/${id}`);
  },
  pay(params) {
    return instance.post(`/payments/pay`, params);
  },
  getDeliverySlots(date) {
    return instance.get(`/deliverySlots`, { params: { date } });
  },
};

export const LANDING = {
  getPackages() {
    return instance.get(`/attribute/package`);
  },
};

export const DISCOUNTS = {
  getDiscounts() {
    return instance.get(`/discounts`);
  },
};

export const WAREHOUSES = {
  getWarehouses() {
    return instance.get(`/warehouses`);
  },
};
