import { createActor } from "xstate";
import { CartItem } from "../../domains/cart/cart";
import { cartMachine } from "../cartState";

describe("cartState", () => {
  let actor: ReturnType<typeof createActor<typeof cartMachine>>;

  const item1: CartItem = { id: 1, price: 100, stock: 1 };
  const item2: CartItem = { id: 2, price: 100, stock: 1 };
  const item3: CartItem = { id: 3, price: 100, stock: 1 };

  beforeEach(() => {
    actor = createActor(cartMachine);
  });

  describe("initialize", () => {
    it("should entries is empty", () => {
      actor.start();
      expect(actor.getSnapshot().context.entries).toEqual([]);
    });
  });

  describe("[default]", () => {
    describe("addItem", () => {
      it("should add item when item isn't in cart", () => {
        // given
        actor.start();

        // when
        actor.send({ type: "addItem", item: item1 });

        // then
        expect(actor.getSnapshot().context.entries).toEqual([
          { item: item1, quantity: 1 },
        ]);
      });

      it("should add quantity when item is already in cart", () => {
        // given
        actor.start();

        // when
        actor.send({ type: "addItem", item: item1 });
        actor.send({ type: "addItem", item: item1 });

        // then
        expect(actor.getSnapshot().context.entries).toEqual([
          { item: item1, quantity: 2 },
        ]);
      });

      it("should change state to isFull when entries is more than 3", () => {
        // given
        actor.start();

        // when
        actor.send({ type: "addItem", item: item1 });
        actor.send({ type: "addItem", item: item2 });
        actor.send({ type: "addItem", item: item3 });

        // then
        expect(actor.getSnapshot().context.entries.length).toBe(3);
        expect(actor.getSnapshot().value).toBe("isFull");
      });
    });

    describe("removeItem", () => {
      it("should nothing when cart is empty", () => {
        // given
        actor.start();

        // when
        actor.send({ type: "removeItem", itemId: 1 });

        // then
        expect(actor.getSnapshot().context.entries).toEqual([]);
      });

      it("should nothing when itemId not matched", () => {
        // given
        actor.start();

        // when
        actor.send({ type: "addItem", item: item1 });
        actor.send({ type: "removeItem", itemId: 2 });
        actor.send({ type: "removeItem", itemId: 3 });
        actor.send({ type: "removeItem", itemId: 4 });
        actor.send({ type: "removeItem", itemId: 5 });

        // then
        expect(actor.getSnapshot().context.entries).toEqual([
          { item: item1, quantity: 1 },
        ]);
      });

      it("should remove cart when before quantity is 1", () => {
        // given
        actor.start();

        // when
        actor.send({ type: "addItem", item: item1 });
        actor.send({ type: "removeItem", itemId: 1 });

        // then
        expect(actor.getSnapshot().context.entries).toEqual([]);
      });

      it("should decrease item in cart when before quantity is more than 1", () => {
        // given
        actor.start();

        // when
        actor.send({ type: "addItem", item: item1 });
        actor.send({ type: "addItem", item: item1 });
        actor.send({ type: "removeItem", itemId: 1 });

        // then
        expect(actor.getSnapshot().context.entries).toEqual([
          { item: item1, quantity: 1 },
        ]);
      });
    });
  });

  describe("[isFull]", () => {
    beforeEach(function changeCartToIsFull() {
      actor.start();

      actor.send({ type: "addItem", item: item1 });
      actor.send({ type: "addItem", item: item2 });
      actor.send({ type: "addItem", item: item3 });
    });

    describe("addItem", () => {
      it("should nothing", () => {
        // given
        const item4: CartItem = { id: 4, price: 100, stock: 1 };

        // when
        actor.send({ type: "addItem", item: item4 });

        // then
        expect(actor.getSnapshot().value).toBe("isFull");
        expect(actor.getSnapshot().context.entries.length).toBe(3);
      });
    });

    describe("remoteItem", () => {
      it("should change state to default", () => {
        // given

        // when
        actor.send({ type: "removeItem", itemId: item1.id });

        // then
        expect(actor.getSnapshot().value).toBe("default");
      });
    });
  });
});
