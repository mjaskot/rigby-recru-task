import StatusError from "../../errors/StatusError";
import { Product } from "../Product.entity";
import { UpdateProduct as IUpdateProduct } from "../Product.interfaces";
import { UpdateProductCommand } from "../Product.types";

export class UpdateProduct {
  #productStore: IUpdateProduct;

  constructor(saveProduct: IUpdateProduct) {
    this.#productStore = saveProduct;
  }

  async exec(cmd: UpdateProductCommand): Promise<Product | undefined> {
    const updatedProduct = await this.#productStore.update(cmd);

    if (!updatedProduct) {
      throw new StatusError(404, "Product not found");
    }

    return updatedProduct;
  }
}
