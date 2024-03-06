import { InMemoryCartStore } from "../infrastructure/InMemoryCartStore";
import { AddProductToCart } from "../core/AddProductToCart";
import { FetchProduct } from "../../product/core/FetchProduct";
import { UpdateProduct } from "../../product/core/UpdateProduct";
import StatusError from "../../errors/StatusError";

describe("Add Product to Cart", () => {
  const store = new InMemoryCartStore();
  const fetchProduct = new FetchProduct(store);
  const updateProduct = new UpdateProduct(store);
  const addProductToCart = new AddProductToCart(
    store,
    fetchProduct,
    updateProduct
  );

  beforeAll(async () => {
    await store.seed();
  });

  it("Should throw error if want to add product without stock", async () => {
    await expect(
      addProductToCart.exec({
        id: "MockCartId-2",
        data: { product_id: "emptyStockedId" },
      })
    ).rejects.toEqual(new StatusError(400, "Product out of stock"));
  });

  it("Should properly add product to cart", async () => {
    const cart = await addProductToCart.exec({
      id: "MockCartId-0",
      data: { product_id: "MockProdId-6" },
    });

    expect(cart.products.length).toBeGreaterThan(0);
    expect(cart.products[0].id).toEqual("MockProdId-6");
  });

  it("Should throw StatusError if product is not found", async () => {
    await expect(
      addProductToCart.exec({ id: "MockCartId-1", data: { product_id: "1" } })
    ).rejects.toEqual(new StatusError(404, "Product not found"));
  });
  it("Should throw StatusError if cart is not found", async () => {
    await expect(
      addProductToCart.exec({ id: "1", data: { product_id: "MockProdId-6" } })
    ).rejects.toEqual(new StatusError(404, "Cart not found"));
  });
});
