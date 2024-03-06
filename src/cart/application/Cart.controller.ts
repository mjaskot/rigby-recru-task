import { RequestHandler } from "express";

import { Cart } from "../Cart.entity";
import { SaveCart } from "../core/SaveCart";
import { AddProductToCart } from "../core/AddProductToCart";
import { FetchCart } from "../core/FetchCart";
import { RemoveProductFromCart } from "../core/RemoveProductFromCart";
import { SaveCartCommand, ProductCartPayload } from "../Cart.types";

import { Logger } from "core/interfaces/Logger";

export class CartController {
  #saveCart: SaveCart;
  #addProductToCart: AddProductToCart;
  #fetchCart: FetchCart;
  #removeProductFromCart: RemoveProductFromCart;
  #logger: Logger;

  constructor(
    logger: Logger,
    saveCart: SaveCart,
    addProductToCart: AddProductToCart,
    fetchCart: FetchCart,
    removeProductFromCart: RemoveProductFromCart
  ) {
    this.#saveCart = saveCart;
    this.#addProductToCart = addProductToCart;
    this.#fetchCart = fetchCart;
    this.#removeProductFromCart = removeProductFromCart;
    this.#logger = logger;
  }

  saveCart: RequestHandler<unknown, Cart, SaveCartCommand, unknown> = async (
    req,
    res,
    next
  ) => {
    try {
      this.#logger.info("Saving cart to database");
      const product = await this.#saveCart.exec(req.body);

      return res.status(200).json(product);
    } catch (err) {
      this.#logger.error(err);
      next(err);
    }
  };

  fetchCart: RequestHandler<{ id: string }, Cart, unknown, unknown> = async (
    req,
    res,
    next
  ) => {
    try {
      this.#logger.info("Fetching cart from database");
      const product = await this.#fetchCart.exec({ id: req.params.id });

      return res.status(200).json(product);
    } catch (err) {
      this.#logger.error(err);
      next(err);
    }
  };

  addProductToCart: RequestHandler<
    { id: string },
    Cart,
    ProductCartPayload,
    unknown
  > = async (req, res, next) => {
    try {
      this.#logger.info("Adding product to cart");
      const cart = await this.#addProductToCart.exec({
        id: req.params.id,
        data: req.body,
      });

      return res.status(200).json(cart);
    } catch (err) {
      this.#logger.error(err);
      next(err);
    }
  };

  removeProductFromCart: RequestHandler<
    { id: string },
    Cart,
    ProductCartPayload,
    unknown
  > = async (req, res, next) => {
    try {
      this.#logger.info("Removing product from cart");
      const cart = await this.#removeProductFromCart.exec({
        id: req.params.id,
        data: req.body,
      });

      return res.status(200).json(cart);
    } catch (err) {
      this.#logger.error(err);
      next(err);
    }
  };
}
