import { InMemoryCartStore } from "../infrastructure/InMemoryCartStore";
import { FetchCart } from "../core/FetchCart";
import StatusError from "../../errors/StatusError";

describe("Fetch Cart", () => {
  const store = new InMemoryCartStore();
  const fetchCart = new FetchCart(store);

  beforeAll(async () => {
    await store.seed();
  });

  it("Fetches cart and its value", async () => {
    const got = await fetchCart.exec({ id: "MockCartId-1" });

    expect(got.value).toEqual(370);
    expect(got.products.length).toEqual(3);
  });

  it("Should throw StatusError of 404 if no cart has been found", async () => {
    await expect(fetchCart.exec({ id: "404" })).rejects.toEqual(
      new StatusError(404, "Cart not found")
    );
  });
});
