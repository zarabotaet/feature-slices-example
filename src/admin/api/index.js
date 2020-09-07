import { PATHS } from 'AppPaths';
import axios from 'axios';

import { history } from 'libs/history';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/admin`,
});

const TOKEN = 'EEHToken';

export const setToken = token => {
  localStorage.setItem(TOKEN, token);
  instance.defaults.headers['Authorization'] = `Bearer ${token}`;
};

export const getToken = () => localStorage.getItem(TOKEN);

export const haveToken = () => getToken() !== null;

export const removeToken = () => localStorage.removeItem(TOKEN);

export const logout = () => {
  removeToken();
  history.push(PATHS.LOGIN);
};

instance.defaults.headers.common[
  'Authorization'
] = `Bearer ${localStorage.getItem(TOKEN)}`;

export const PRODUCTS = {
  getAll() {
    return instance.get('products');
  },
  create(params) {
    return instance.post('products', params);
  },
  delete(id) {
    return instance.delete(`products/${id}`);
  },
  update(id, params) {
    return instance.put(`products/${id}`, params);
  },
};
