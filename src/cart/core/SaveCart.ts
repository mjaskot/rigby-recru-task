import { Cart } from "../Cart.entity";
import { SaveCart as ISaveCart } from "../Cart.interfaces";
import { SaveCartCommand } from "../Cart.types";

export class SaveCart {
  #cartStore: ISaveCart;

  constructor(saveCart: ISaveCart) {
    this.#cartStore = saveCart;
  }

  async exec(cmd: SaveCartCommand): Promise<Cart> {
    return this.#cartStore.save(cmd);
  }
}
