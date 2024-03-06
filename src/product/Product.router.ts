import { Router } from "express";

import { WinstonLogger } from "../core/WinstonLogger";

import { ProductController } from "./application/Products.controller";
import { SaveProduct } from "./core/SaveProduct";
import { PostgresProductStore } from "./infrastructure/PostgresProductStore";
import { ListProducts } from "./core/ListProducts";
import { FetchProduct } from "./core/FetchProduct";
import { UpdateProduct } from "./core/UpdateProduct";
import { DeleteProduct } from "./core/DeleteProduct";
import {
  createAddProductValidator,
  createUpdateProductValidator,
} from "./Product.validators";

const logger = new WinstonLogger("PRODUCT");

//Storage
const productsStore = new PostgresProductStore();

//Commands and Queries
const addUser = new SaveProduct(productsStore);
const listProducts = new ListProducts(productsStore);
const fetchProduct = new FetchProduct(productsStore);
const updateProduct = new UpdateProduct(productsStore);
const deleteProduct = new DeleteProduct(productsStore);

//Handlers
const productController = new ProductController(
  logger,
  addUser,
  listProducts,
  fetchProduct,
  updateProduct,
  deleteProduct
);

export const createProductsRouter = (): Router => {
  const router = Router();

  router.get("/", productController.listProducts);
  router.get("/:id", productController.fetch);
  router.post("/", createAddProductValidator(), productController.saveProduct);
  router.patch(
    "/:id",
    createUpdateProductValidator(),
    productController.update
  );
  router.delete("/:id", productController.delete);

  return router;
};
