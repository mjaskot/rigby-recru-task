import StatusError from "../../errors/StatusError";
import { Cart } from "../Cart.entity";
import { AddProductToCart as IAddProductToCart } from "../Cart.interfaces";
import { AddProductToCartCommand } from "../Cart.types";
import { FetchProduct } from "../../product/core/FetchProduct";
import { UpdateProduct } from "../../product/core/UpdateProduct";

export class AddProductToCart {
  #cartStore: IAddProductToCart;
  #fetchProduct: FetchProduct;
  #updateProduct: UpdateProduct;

  constructor(
    cartStore: IAddProductToCart,
    fetchProduct: FetchProduct,
    updateProduct: UpdateProduct
  ) {
    this.#cartStore = cartStore;
    this.#fetchProduct = fetchProduct;
    this.#updateProduct = updateProduct;
  }

  async exec(cmd: AddProductToCartCommand): Promise<Cart> {
    const product = await this.#fetchProduct.exec({ id: cmd.data.product_id });

    if (!product) {
      throw new StatusError(404, "Product not found");
    }

    if (product.stock < 1) {
      throw new StatusError(400, "Product out of stock");
    }

    const cart = await this.#cartStore.addProduct(cmd);

    if (!cart) {
      throw new StatusError(404, "Cart not found");
    }

    await this.#updateProduct.exec({
      id: product.id,
      data: { stock: product.stock - 1 },
    });

    return cart;
  }
}
