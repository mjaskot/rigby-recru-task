import { Router } from "express";

import { WinstonLogger } from "../core/WinstonLogger";

import { PostgresCartStore } from "./infrastructure/PostgresCartStore";
import { CartController } from "./application/Cart.controller";
import { SaveCart } from "./core/SaveCart";
import { FetchCart } from "./core/FetchCart";
import { AddProductToCart } from "./core/AddProductToCart";
import { RemoveProductFromCart } from "./core/RemoveProductFromCart";
import { PostgresProductStore } from "../product/infrastructure/PostgresProductStore";
import { FetchProduct } from "../product/core/FetchProduct";
import { UpdateProduct } from "../product/core/UpdateProduct";

const logger = new WinstonLogger("PRODUCT");

//Storage
const cartStore = new PostgresCartStore();
const productStore = new PostgresProductStore();

//Commands and Queries
const saveCart = new SaveCart(cartStore);
const fetchCart = new FetchCart(cartStore);
const fetchProduct = new FetchProduct(productStore);
const updateProduct = new UpdateProduct(productStore);
const addProductToCart = new AddProductToCart(
  cartStore,
  fetchProduct,
  updateProduct
);
const removeProductFromCart = new RemoveProductFromCart(
  cartStore,
  updateProduct,
  fetchProduct
);

//Handlers
const cartController = new CartController(
  logger,
  saveCart,
  addProductToCart,
  fetchCart,
  removeProductFromCart
);

export const createCartRouter = (): Router => {
  const router = Router();

  router.get("/:id", cartController.fetchCart);
  router.post("/", cartController.saveCart);
  router.patch("/:id", cartController.addProductToCart);
  router.delete("/:id", cartController.removeProductFromCart);

  return router;
};
