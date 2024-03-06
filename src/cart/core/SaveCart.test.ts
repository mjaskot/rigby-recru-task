import { InMemoryCartStore } from "../infrastructure/InMemoryCartStore";
import { SaveCart } from "../core/SaveCart";

describe("Save new Cart", () => {
  const store = new InMemoryCartStore();
  const saveCart = new SaveCart(store);

  it("Saves new cart to database", async () => {
    const got = await saveCart.exec({});

    expect(got.id).not.toBeUndefined();
    expect(got.products.length).toEqual(0);
    expect(got.createdAt).toBeDefined();
    expect(got.updatedAt).toBeDefined();
  });
});
