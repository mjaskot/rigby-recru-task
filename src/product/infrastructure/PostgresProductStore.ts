import {
  SaveProduct,
  ListProducts,
  DeleteProduct,
  UpdateProduct,
	FetchProduct
} from "../Product.interfaces";
import {
  SaveProductCommand,
  ListProductQuery,
  ListProductQueryResponse,
  DeleteProductCommand,
  FetchProduectQuery,
  UpdateProductCommand,
} from "../Product.types";
import { Product } from "../Product.entity";
import StatusError from "../../errors/StatusError";

import { PostgresDataSource } from "../../data-source";

export class PostgresProductStore
  implements SaveProduct, ListProducts, DeleteProduct, UpdateProduct, FetchProduct
{
  async save(cmd: SaveProductCommand): Promise<Product> {
    try {
      const product = new Product();
      product.name = cmd.name;
      product.price = cmd.price;
      product.stock = cmd.stock;

      const userRepository = PostgresDataSource.getRepository(Product);
      await userRepository.save(product);

      return product;
    } catch (err) {
      throw new StatusError(500, "Error adding product", {
        originalError: err,
      });
    }
  }

  async list(query: ListProductQuery): Promise<ListProductQueryResponse> {
    try {
      const qb =
        PostgresDataSource.getRepository(Product).createQueryBuilder("product");
      const list = await qb.skip(query.skip).take(query.limit).getMany();
      const total = await qb.getCount();

      return { data: list, total };
    } catch (err) {
      throw new StatusError(500, "Error adding product", {
        originalError: err,
      });
    }
  }

  async delete(cmd: DeleteProductCommand): Promise<Product | undefined> {
    try {
      const qb =
        PostgresDataSource.getRepository(Product).createQueryBuilder("product");

      const product = await qb
        .where("product.id = :id", { id: cmd.id })
        .getOne();

      if (!product) {
        return undefined;
      }

      await qb.delete().where("product.id = :id", { id: cmd.id }).execute();

      return product;
    } catch (err) {
      throw new StatusError(500, "Error adding product", {
        originalError: err,
      });
    }
  }

  async fetch(query: FetchProduectQuery): Promise<Product | undefined> {
    try {
      const qb =
        PostgresDataSource.getRepository(Product).createQueryBuilder("product");

      const product = await qb
        .where("product.id = :id", { id: query.id })
        .getOne();

      if (!product) {
        return undefined;
      }

      return product;
    } catch (err) {
      throw new StatusError(500, "Error fetching product", {
        originalError: err,
      });
    }
  }

  async update(cmd: UpdateProductCommand): Promise<Product | undefined> {
    try {
      const qb =
        PostgresDataSource.getRepository(Product).createQueryBuilder("product");

      const product = await qb
        .where("product.id = :id", { id: cmd.id })
        .getOne();

      if (!product) {
        return undefined;
      }

      await qb
        .update(Product)
        .set(cmd.data)
        .where("product.id = :id", { id: cmd.id })
        .execute();

      return product;
    } catch (err) {
      throw new StatusError(500, "Error fetching product", {
        originalError: err,
      });
    }
  }
}
