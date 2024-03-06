import StatusError from "../../errors/StatusError";
import { Product } from "../Product.entity";
import { FetchProduct as IFetchProduct } from "../Product.interfaces";

import { FetchProduectQuery } from "../Product.types";

export class FetchProduct {
  #productStore: IFetchProduct;

  constructor(listProducts: IFetchProduct) {
    this.#productStore = listProducts;
  }

  async exec(query: FetchProduectQuery): Promise<Product> {
    const foundProduct = await this.#productStore.fetch(query);

    if (!foundProduct) {
      throw new StatusError(404, "Product not found");
    }

    return foundProduct;
  }
}
