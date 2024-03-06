export type SaveCartCommand = {};

export type AddProductToCartCommand = {
  id: string;
  data: ProductCartPayload;
};

export type ProductCartPayload = {
  product_id: string;
};

export type RemoveProductFromCartCommand = {
  id: string;
  data: ProductCartPayload;
};

export type FetchCartQuery = {
  id: string;
};
