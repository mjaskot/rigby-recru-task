import StatusError from "../../errors/StatusError";
import { Cart } from "../Cart.entity";
import { RemoveProductFromCart as IRemoveProductFromCart } from "../Cart.interfaces";
import { RemoveProductFromCartCommand } from "../Cart.types";
import { UpdateProduct } from "../../product/core/UpdateProduct";
import { FetchProduct } from "../../product/core/FetchProduct";

export class RemoveProductFromCart {
  #cartStore: IRemoveProductFromCart;
  #updateProducts: UpdateProduct;
  #fetchProduct: FetchProduct;

  constructor(
    removeProductFromCart: IRemoveProductFromCart,
    updateProduct: UpdateProduct,
    fetchProduct: FetchProduct
  ) {
    this.#cartStore = removeProductFromCart;
    this.#fetchProduct = fetchProduct;
    this.#updateProducts = updateProduct;
  }

  async exec(cmd: RemoveProductFromCartCommand): Promise<Cart> {
    const product = await this.#fetchProduct.exec({ id: cmd.data.product_id });

    if (!product) {
      throw new StatusError(404, "Product not found");
    }

    const cart = await this.#cartStore.removeProduct(cmd);

    if (!cart) {
      throw new StatusError(404, "Cart not found");
    }

    await this.#updateProducts.exec({
      id: product.id,
      data: { stock: product.stock + 1 },
    });

    return cart;
  }
}
