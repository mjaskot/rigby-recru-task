import {
  AddProductToCart,
  GetCart,
  RemoveProductFromCart,
  SaveCart,
} from "../Cart.interfaces";

import {
  AddProductToCartCommand,
  FetchCartQuery,
  RemoveProductFromCartCommand,
  SaveCartCommand,
} from "../Cart.types";
import { Cart } from "../Cart.entity";
import StatusError from "../../errors/StatusError";

import { PostgresDataSource } from "../../data-source";
import { Product } from "../../product/Product.entity";

export class PostgresCartStore
  implements SaveCart, GetCart, AddProductToCart, RemoveProductFromCart
{
  async save(_cmd: SaveCartCommand): Promise<Cart> {
    try {
      const cart = new Cart();

      const cartRepository = PostgresDataSource.getRepository(Cart);
      await cartRepository.save(cart);

      return cart;
    } catch (err) {
      console.log(err);
      throw new StatusError(500, "Error adding cart", {
        originalError: err,
      });
    }
  }

  async get(query: FetchCartQuery): Promise<Cart | undefined> {
    try {
      const qb =
        PostgresDataSource.getRepository(Cart).createQueryBuilder("cart");
      const cart = await qb
        .where("cart.id = :id", { id: query.id })
        .leftJoinAndSelect("cart.products", "product")
        .getOne();

      if (!cart) {
        return undefined;
      }

      return cart;
    } catch (err) {
      throw new StatusError(500, "Error fetching cart", {
        originalError: err,
      });
    }
  }

  async removeProduct(
    cmd: RemoveProductFromCartCommand
  ): Promise<Cart | undefined> {
    try {
      const cart = await PostgresDataSource.getRepository(Cart).findOne({
        relations: {
          products: true,
        },
        where: { id: cmd.id },
      });

      if (!cart) {
        return undefined;
      }

      cart.products = cart.products.filter((product) => {
        return product.id !== cmd.data.product_id;
      });

      await PostgresDataSource.manager.save(cart);

      return cart;
    } catch (err) {
      throw new StatusError(500, "Error removing product from cart", {
        originalError: err,
      });
    }
  }

  async addProduct(cmd: AddProductToCartCommand): Promise<Cart | undefined> {
    try {
      const cart = await PostgresDataSource.getRepository(Cart).findOne({
        relations: {
          products: true,
        },
        where: { id: cmd.id },
      });

      if (!cart) {
        return undefined;
      }

      const product = await PostgresDataSource.getRepository(Product).findOne({
        where: { id: cmd.data.product_id },
      });

      if (!product) {
        throw new StatusError(404, "Product not found");
      }

      cart.products.push(product);

      await PostgresDataSource.manager.save(cart);

      return cart;
    } catch (err) {
      console.log(err);
      throw new StatusError(500, "Error adding product to cart", {
        originalError: err,
      });
    }
  }
}
