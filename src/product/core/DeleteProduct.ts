import StatusError from "../../errors/StatusError";
import { Product } from "../Product.entity";
import { DeleteProduct as IDeleteProduct } from "../Product.interfaces";
import { DeleteProductCommand } from "../Product.types";

export class DeleteProduct {
  #productStore: IDeleteProduct;

  constructor(saveProduct: IDeleteProduct) {
    this.#productStore = saveProduct;
  }

  async exec(cmd: DeleteProductCommand): Promise<Product | undefined> {
    const deletedProduct = await this.#productStore.delete(cmd);

    if (!deletedProduct) {
      throw new StatusError(404, "Product not found");
    }

    return deletedProduct;
  }
}
