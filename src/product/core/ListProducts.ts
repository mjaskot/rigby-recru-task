import { ListProducts as IListProducts } from "../Product.interfaces";

import { ListProductQuery, ListProductQueryResponse } from "../Product.types";

export class ListProducts {
  #productStore: IListProducts;

  constructor(listProducts: IListProducts) {
    this.#productStore = listProducts;
  }

  async exec(query: ListProductQuery): Promise<ListProductQueryResponse> {
    return this.#productStore.list(query);
  }
}
