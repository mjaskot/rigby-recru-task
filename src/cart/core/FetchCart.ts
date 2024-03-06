import StatusError from "../../errors/StatusError";
import { Cart } from "../Cart.entity";
import { GetCart as IFetchCart } from "../Cart.interfaces";
import { FetchCartQuery } from "../Cart.types";

export class FetchCart {
  #cartStore: IFetchCart;

  constructor(fetchCart: IFetchCart) {
    this.#cartStore = fetchCart;
  }

  async exec(query: FetchCartQuery): Promise<Cart & { value: number }> {
    const cart = await this.#cartStore.get(query);

    if (!cart) {
      throw new StatusError(404, "Cart not found");
    }

    return {
      ...cart,
      value: cart.products
        .map((p) => p.price)
        .reduce((prev, curr) => prev + curr, 0),
    };
  }
}
