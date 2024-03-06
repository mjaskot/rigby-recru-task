import { Product } from "./Product.entity";
import {
  SaveProductCommand,
  ListProductQuery,
  ListProductQueryResponse,
  UpdateProductCommand,
  DeleteProductCommand,
  FetchProduectQuery,
} from "./Product.types";

export interface SaveProduct {
  save(cmd: SaveProductCommand): Promise<Product>;
}

export interface ListProducts {
  list(query: ListProductQuery): Promise<ListProductQueryResponse>;
}

export interface UpdateProduct {
  update(cmd: UpdateProductCommand): Promise<Product | undefined>;
}

export interface DeleteProduct {
  delete(cmd: DeleteProductCommand): Promise<Product | undefined>;
}

export interface FetchProduct {
  fetch(query: FetchProduectQuery): Promise<Product | undefined>;
}
