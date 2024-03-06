import { Product } from "./Product.entity";

export type SaveProductCommand = {
  name: string;
  price: number;
  stock: number;
};

export type UpdateProductCommand = {
  id: string;
  data: UpdateProductPayload;
};

export type UpdateProductPayload = Partial<SaveProductCommand>;

export type DeleteProductCommand = {
  id: string;
};

export type FetchProduectQuery = {
  id: string;
};

export type ListProductQuery = {
  skip: number;
  limit: number;
};

export type ListProductQueryResponse = {
  data: Product[];
  total: number;
};
