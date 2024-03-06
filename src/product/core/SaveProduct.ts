import { Product } from "../Product.entity";
import { SaveProduct as ISaveProduct } from "../Product.interfaces";
import { SaveProductCommand } from "../Product.types";

export class SaveProduct {
  #productStore: ISaveProduct;

  constructor(saveProduct: ISaveProduct) {
    this.#productStore = saveProduct;
  }

  async exec(cmd: SaveProductCommand): Promise<Product> {
    return this.#productStore.save(cmd);
  }
}
