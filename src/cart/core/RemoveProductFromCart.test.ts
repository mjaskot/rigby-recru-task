import { InMemoryCartStore } from "../infrastructure/InMemoryCartStore";
import { RemoveProductFromCart } from "../core/RemoveProductFromCart";
import { FetchProduct } from "../../product/core/FetchProduct";
import { UpdateProduct } from "../../product/core/UpdateProduct";
import StatusError from "../../errors/StatusError";

describe("Remove Product from Cart", () => {
  const store = new InMemoryCartStore();
  const fetchProduct = new FetchProduct(store);
  const updateProduct = new UpdateProduct(store);
  const removeProductFromCart = new RemoveProductFromCart(
    store,
    updateProduct,
    fetchProduct
  );

  beforeAll(async () => {
    await store.seed();
  });

	it("Should throw error if product was not found", async () => {
    await expect(
      removeProductFromCart.exec({
        id: "MockCartId-0",
        data: { product_id: "404" },
      })
    ).rejects.toEqual(new StatusError(404, "Product not found"));
  });

  it("Should throw error if cart was not found", async () => {
    await expect(
      removeProductFromCart.exec({
        id: "404",
        data: { product_id: "MockProdId-6" },
      })
    ).rejects.toEqual(new StatusError(404, "Cart not found"));
  });

  it("Should sucessfully remove item from cart", async () => {
    const cart = await removeProductFromCart.exec({
      id: "MockCartId-1",
      data: { product_id: "MockProdId-7" },
    });

    expect(cart.products.length).toEqual(2);
  });
});
