import { assign, setup } from "xstate";
import { CartEntry, CartItem } from "../domains/cart/cart";
import { useMachine } from "@xstate/react";

interface CartMachineContext {
  entries: CartEntry[];
}

type CartMachineEvents =
  | { type: "addItem"; item: CartItem }
  | { type: "removeItem"; itemId: number };

export const cartMachine = setup({
  types: {
    context: {} as CartMachineContext,
    events: {} as CartMachineEvents,
  },
  actions: {
    addItem: assign({
      entries: ({ context }, event: { item: CartItem }) => {
        const isExistsItem = context.entries.some(
          (entry) => entry.item.id === event.item.id
        );

        if (isExistsItem) {
          return context.entries.map((entry) =>
            entry.item.id === event.item.id
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry
          );
        }

        return [...context.entries, { item: event.item, quantity: 1 }];
      },
    }),
    remoteItem: assign({
      entries: ({ context }, event: { itemId: number }) => {
        const updatedEntries = context.entries.reduce<CartEntry[]>(
          (acc, cur) => {
            if (cur.item.id !== event.itemId) {
              acc.push(cur);
              return acc;
            }

            const quantity = cur.quantity - 1;

            if (!quantity) {
              return acc;
            }

            acc.push({ ...cur, quantity });
            return acc;
          },
          []
        );

        return updatedEntries;
      },
    }),
  },
  guards: {
    isCartEmpty: ({ context }) => !context.entries.length,
  },
}).createMachine({
  id: "cart",
  initial: "default",
  context: { entries: [] },
  states: {
    default: {
      on: {
        addItem: {
          actions: {
            type: "addItem",
            params: ({ event }) => ({ item: event.item }),
          },
        },
        removeItem: {
          actions: {
            type: "remoteItem",
            params: ({ event }) => ({ itemId: event.itemId }),
          },
        },
      },
    },
  },
});

export const useCart = () => useMachine(cartMachine);
