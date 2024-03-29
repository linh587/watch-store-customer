export const ENVIRONMENT = "http://localhost:8080/";

export const API_URL = {
  // AUTH
  LOGIN: "sign-in/user",
  REGISTER: "sign-up",
  REFRESH_TOKEN: "refresh/user",
  GET_DETAIL_USER: "user/information",
  EDIT_USER: "user/information",
  CHANGE_PASSWORD: "user/password",
  FORGOT_PASSWORD: "sign-in/forgot",
  RESET_PASSWORD: "sign-in/reset",
  VERIFY: "sign-up/verify",

  // PRODUCT
  GET_LIST_PRODUCTS: "product",
  DETAIL_PRODUCT: "product",

  // PRODUCT PRICE
  GET_PRODUCT_PRICES: "product-price",
  GET_DETAIL_PRODUCT_PRICE: "product-price",

  // PRODUCT SIZE
  GET_PRODUCT_SIZES: "product-size",
  GET_DETAIL_PRODUCT_SIZE: "product-size",

  //CART
  ADD_TO_CART: "user/cart",
  CART: "user/cart",

  // ORDER
  GET_ORDER_LIST: "user/order",
  ORDER: "order",

  // CATEGORY
  GET_LIST_CATEGORY: "category",
};
