import { v4 } from "uuid";
import {
  AddProductToCartCommand,
  FetchCartQuery,
  RemoveProductFromCartCommand,
  SaveCartCommand,
} from "cart/Cart.types";
import { FetchProduct, UpdateProduct } from "../../product/Product.interfaces";
import { Cart } from "../Cart.entity";
import {
  AddProductToCart,
  RemoveProductFromCart,
  SaveCart,
  GetCart,
} from "../Cart.interfaces";
import { Product } from "../../product/Product.entity";
import {
  FetchProduectQuery,
  UpdateProductCommand,
} from "product/Product.types";

export class InMemoryCartStore
  implements
    SaveCart,
    GetCart,
    RemoveProductFromCart,
    AddProductToCart,
    FetchProduct,
    UpdateProduct
{
  #carts: Map<string, Cart>;
  #products: Map<string, Product>;

  constructor() {
    this.#carts = new Map();
    this.#products = new Map();
  }

  async seed() {
    for (let i = 0; i < 2; i++) {
      const cart = new Cart();
      cart.id = `MockCartId-${i}`;
      cart.products = [];
      cart.createdAt = new Date();
      cart.updatedAt = new Date();

      this.#carts.set(cart.id, cart);
    }

    for (let i = 0; i < 10; i++) {
      const product = new Product();
      product.id = `MockProdId-${i}`;
      product.name = `MockProd-${i}`;
      product.price = 100 + i * 5;
      product.stock = 5 + i;

      this.#products.set(product.id, product);
    }

    const emptyStockedProduct = new Product();
    emptyStockedProduct.id = "emptyStockedId";
    emptyStockedProduct.name = "Product1";
    emptyStockedProduct.price = 100;
    emptyStockedProduct.stock = 0;
    emptyStockedProduct.createdAt = new Date();
    emptyStockedProduct.updatedAt = new Date();
    this.#products.set(emptyStockedProduct.id, emptyStockedProduct);

    await this.addProduct({
      id: `MockCartId-1`,
      data: { product_id: "MockProdId-2" },
    });
    await this.addProduct({
      id: `MockCartId-1`,
      data: { product_id: "MockProdId-5" },
    });
    await this.addProduct({
      id: `MockCartId-1`,
      data: { product_id: "MockProdId-7" },
    });
  }

  async save(_cmd: SaveCartCommand): Promise<Cart> {
    const cart = new Cart();

    cart.id = v4();
    cart.products = [];
    cart.createdAt = new Date();
    cart.updatedAt = new Date();

    this.#carts.set(cart.id, cart);
    return cart;
  }

  async get(query: FetchCartQuery): Promise<Cart | undefined> {
    const cart = this.#carts.get(query.id);

    return cart;
  }

  async addProduct(cmd: AddProductToCartCommand): Promise<Cart | undefined> {
    const cart = this.#carts.get(cmd.id);

    if (!cart) {
      return undefined;
    }

    const product = this.#products.get(cmd.data.product_id);

    if (!product) {
      return undefined;
    }

    cart.products.push(product);

    this.#carts.set(cmd.id, cart);

    return cart;
  }

  async removeProduct(
    cmd: RemoveProductFromCartCommand
  ): Promise<Cart | undefined> {
    const cart = this.#carts.get(cmd.id);

    if (!cart) {
      return undefined;
    }

    cart.products = cart.products.filter((product) => {
      return product.id !== cmd.data.product_id;
    });

    this.#carts.set(cmd.id, cart);

    return cart;
  }

  async fetch(query: FetchProduectQuery): Promise<Product | undefined> {
    const product = this.#products.get(query.id);

    if (!product) {
      return undefined;
    }

    return product;
  }

  async update(cmd: UpdateProductCommand) {
    const product = this.#products.get(cmd.id);

    if (!product) {
      return undefined;
    }

    if (cmd.data.name) {
      product.name = cmd.data.name;
    }
    if (cmd.data.price) {
      product.price = cmd.data.price;
    }
    if (cmd.data.stock) {
      product.stock = cmd.data.stock;
    }

    this.#products.set(product.id, product);

    return product;
  }
}
