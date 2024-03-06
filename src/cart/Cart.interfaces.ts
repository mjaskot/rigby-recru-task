import {
  SaveCartCommand,
  AddProductToCartCommand,
  FetchCartQuery,
  RemoveProductFromCartCommand,
} from "./Cart.types";
import { Cart } from "./Cart.entity";

export interface SaveCart {
  save(cmd: SaveCartCommand): Promise<Cart>;
}

export interface AddProductToCart {
  addProduct(cmd: AddProductToCartCommand): Promise<Cart | undefined>;
}

export interface GetCart {
  get(query: FetchCartQuery): Promise<Cart | undefined>;
}

export interface RemoveProductFromCart {
  removeProduct(cmd: RemoveProductFromCartCommand): Promise<Cart | undefined>;
}
