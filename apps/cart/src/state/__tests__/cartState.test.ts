import { CartItem } from "../../domains/cart/cart";
import { useCart } from "../cartState";
import { act, renderHook } from "@testing-library/react";

describe("cartState", () => {
  const item1: CartItem = { id: 1, price: 100, stock: 1 };
  const item2: CartItem = { id: 2, price: 100, stock: 1 };
  const item3: CartItem = { id: 3, price: 100, stock: 1 };

  const prepare = () => renderHook(() => useCart());

  describe("initialize", () => {
    it("should entries is empty", () => {
      const { result } = prepare();
      const [state] = result.current;
      expect(state.context.entries).toEqual([]);
    });
  });

  describe("[default]", () => {
    describe("addItem", () => {
      it("should add item when item isn't in cart", () => {
        // given
        const { result } = prepare();
        const [_, send] = result.current;

        // when
        act(() => {
          send({ type: "addItem", item: item1 });
        });

        // then
        const [state] = result.current;
        expect(state.context.entries).toEqual([{ item: item1, quantity: 1 }]);
      });

      it("should add quantity when item is already in cart", () => {
        // given
        const { result } = prepare();
        const [_, send] = result.current;

        // when
        act(() => {
          send({ type: "addItem", item: item1 });
          send({ type: "addItem", item: item1 });
        });

        // then
        const [state] = result.current;
        expect(state.context.entries).toEqual([{ item: item1, quantity: 2 }]);
      });

      it("should change state to isFull when entries is more than 3", () => {
        // given
        const { result } = prepare();
        const [_, send] = result.current;

        // when
        act(() => {
          send({ type: "addItem", item: item1 });
          send({ type: "addItem", item: item2 });
          send({ type: "addItem", item: item3 });
        });

        // then
        const [state] = result.current;
        expect(state.context.entries.length).toBe(3);
        expect(state.value).toBe("isFull");
      });
    });

    describe("removeItem", () => {
      it("should nothing when cart is empty", () => {
        // given
        const { result } = prepare();
        const [_, send] = result.current;

        // when
        act(() => {
          send({ type: "removeItem", itemId: 1 });
        });

        // then
        const [state] = result.current;
        expect(state.context.entries).toEqual([]);
      });

      it("should nothing when itemId not matched", () => {
        // given
        const { result } = prepare();
        const [_, send] = result.current;

        // when
        act(() => {
          send({ type: "addItem", item: item1 });
          send({ type: "removeItem", itemId: 2 });
          send({ type: "removeItem", itemId: 3 });
          send({ type: "removeItem", itemId: 4 });
          send({ type: "removeItem", itemId: 5 });
        });

        // then
        const [state] = result.current;
        expect(state.context.entries).toEqual([{ item: item1, quantity: 1 }]);
      });

      it("should remove cart when before quantity is 1", () => {
        // given
        const { result } = prepare();
        const [_, send] = result.current;

        // when
        act(() => {
          send({ type: "addItem", item: item1 });
          send({ type: "removeItem", itemId: 1 });
        });

        // then
        const [state] = result.current;
        expect(state.context.entries).toEqual([]);
      });

      it("should decrease item in cart when before quantity is more than 1", () => {
        // given
        const { result } = prepare();
        const [_, send] = result.current;

        // when
        act(() => {
          send({ type: "addItem", item: item1 });
          send({ type: "addItem", item: item1 });
          send({ type: "removeItem", itemId: 1 });
        });

        // then
        const [state] = result.current;
        expect(state.context.entries).toEqual([{ item: item1, quantity: 1 }]);
      });
    });
  });

  describe("[isFull]", () => {
    let sut = prepare();

    beforeEach(function changeCartToIsFull() {
      sut = prepare();
      const [_, send] = sut.result.current;

      act(() => {
        send({ type: "addItem", item: item1 });
        send({ type: "addItem", item: item2 });
        send({ type: "addItem", item: item3 });
      });
    });

    describe("addItem", () => {
      it("should nothing", () => {
        // given
        const [_, send] = sut.result.current;
        const item4: CartItem = { id: 4, price: 100, stock: 1 };

        // when
        act(() => {
          send({ type: "addItem", item: item4 });
        });

        // then
        const [state] = sut.result.current;
        expect(state.value).toBe("isFull");
        expect(state.context.entries.length).toBe(3);
      });
    });

    describe("remoteItem", () => {
      it("should change state to default", () => {
        // given
        const [_, send] = sut.result.current;

        // when
        act(() => {
          send({ type: "removeItem", itemId: item1.id });
        });

        // then
        const [state] = sut.result.current;
        expect(state.value).toBe("default");
      });
    });
  });
});
