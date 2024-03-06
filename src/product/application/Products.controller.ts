import { RequestHandler } from "express";

import { Logger } from "core/interfaces/Logger";
import { SaveProduct } from "../core/SaveProduct";
import { ListProducts } from "../core/ListProducts";
import { FetchProduct } from "../core/FetchProduct";
import { UpdateProduct } from "../core/UpdateProduct";
import { DeleteProduct } from "../core/DeleteProduct";
import {
  ListProductQuery,
  ListProductQueryResponse,
  SaveProductCommand,
  DeleteProductCommand,
  UpdateProductPayload,
} from "../Product.types";
import { Product } from "../Product.entity";

export class ProductController {
  #saveProduct: SaveProduct;
  #listProducts: ListProducts;
  #fetchProduct: FetchProduct;
  #updateProduct: UpdateProduct;
  #deleteProduct: DeleteProduct;

  #logger: Logger;

  constructor(
    logger: Logger,
    saveProduct: SaveProduct,
    listProducts: ListProducts,
    fetchProduct: FetchProduct,
    updateProduct: UpdateProduct,
    deleteProduct: DeleteProduct
  ) {
    this.#logger = logger;
    this.#saveProduct = saveProduct;
    this.#listProducts = listProducts;
    this.#fetchProduct = fetchProduct;
    this.#updateProduct = updateProduct;
    this.#deleteProduct = deleteProduct;
  }

  saveProduct: RequestHandler<unknown, Product, SaveProductCommand, unknown> =
    async (req, res, next) => {
      try {
        this.#logger.info("Saving product to database");
        const product = await this.#saveProduct.exec(req.body);

        return res.status(200).json(product);
      } catch (err) {
        this.#logger.error(err);
        next(err);
      }
    };

  listProducts: RequestHandler<
    unknown,
    ListProductQueryResponse,
    unknown,
    ListProductQuery
  > = async (req, res, next) => {
    try {
      const { skip, limit } = req.query;

      const products = await this.#listProducts.exec({ skip, limit });

      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  };

  fetch: RequestHandler<{ id: string }, unknown, Product, unknown> = async (
    req,
    res,
    next
  ) => {
    try {
      const id = req.params.id;

      const products = await this.#fetchProduct.exec({ id });

      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  };

  update: RequestHandler<
    { id: string },
    Product,
    UpdateProductPayload,
    unknown
  > = async (req, res, next) => {
    try {
      const updateCommand = { id: req.params.id, data: req.body };
      const result = await this.#updateProduct.exec(updateCommand);

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  delete: RequestHandler<DeleteProductCommand, Product, unknown, unknown> =
    async (req, res, next) => {
      try {
        const id = req.params.id;

        const deletedProduct = await this.#deleteProduct.exec({ id });

        return res.status(200).json(deletedProduct);
      } catch (err) {
        next(err);
      }
    };
}
