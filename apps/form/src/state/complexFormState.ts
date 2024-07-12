import { assign, setup } from "xstate";
import { ComplexFormData, Permission, Role } from "../types/complexForm";
import { useMachine } from "@xstate/react";
import { containsNonKorean, isNumericString } from "../utils/stringUtil";

interface ComplexFormState {
  values: Partial<ComplexFormData>;
}

interface OnChangeEventBase<K extends keyof ComplexFormData> {
  type: `update_${K}`;
}

type OnChangeEvent<K extends keyof ComplexFormData> = K extends "isForeigner"
  ? OnChangeEventBase<K> & { value: boolean }
  : K extends "role"
  ? OnChangeEventBase<K> & { value: Role }
  : K extends "permission"
  ? OnChangeEventBase<K> & { value: Permission }
  : OnChangeEventBase<K> & { value: string };

type ComplicatedFormEvents =
  | OnChangeEvent<keyof ComplexFormData>
  | {
      type: "onSubmit";
    };

export const complexFormMachine = setup({
  types: {
    context: {} as ComplexFormState,
    events: {} as ComplicatedFormEvents,
  },
  actions: {
    update_name: assign({
      values: ({ context }, event: { value: string }) => ({
        ...context.values,
        name: event.value,
      }),
    }),
    update_age: assign({
      values: ({ context }, event: { value: string }) => ({
        ...context.values,
        age: event.value ? Number(event.value) : undefined,
      }),
    }),
    update_role: assign({
      values: ({ context }, event: { value: Role }) => {
        return { ...context.values, role: event.value };
      },
    }),
    update_permission: assign({
      values: ({ context }, event: { value: Permission }) => ({
        ...context.values,
        permission: event.value,
      }),
    }),
    update_isForeigner: assign({
      values: ({ context }, event: { value: boolean }) => ({
        ...context.values,
        isForeigner: event.value,
      }),
    }),
  },
  guards: {
    containsNonKorean: ({ context }) =>
      !!context.values.name && containsNonKorean(context.values.name),
    notContainsNonKorean: ({ context }) =>
      !context.values.name || !containsNonKorean(context.values.name),
    guestSelected: ({ context }) => context.values.role === "guest",
    guestNotSelected: ({ context }) => context.values.role !== "guest",
    isEditorSelected: ({ context }) => context.values.permission === "editor",
  },
}).createMachine({
  id: "complicatedForm",
  initial: "idle",
  context: {
    values: {
      role: "admin",
      permission: "editor",
      isForeigner: false,
    },
  },
  states: {
    idle: {
      type: "parallel",
      on: {
        update_age: {
          guard: ({ event }) => !event.value || isNumericString(event.value),
          actions: { type: "update_age", params: ({ event }) => event },
        },
        update_permission: {
          actions: {
            type: "update_permission",
            params: ({ event }) => event,
          },
        },
        update_isForeigner: {
          actions: {
            type: "update_isForeigner",
            params: ({ event }) => event,
          },
        },
      },
      states: {
        name: {
          initial: "default",
          always: {
            guard: "containsNonKorean",
            target: ".containsNonKorean",
          },
          on: {
            update_name: {
              actions: {
                type: "update_name",
                params: ({ event }) => event,
              },
            },
          },
          states: {
            default: {},
            containsNonKorean: {
              always: {
                guard: "notContainsNonKorean",
                target: "default",
                actions: {
                  type: "update_isForeigner",
                  params: () => ({ value: false }),
                },
              },
            },
          },
        },
        role: {
          initial: "default",
          always: [{ guard: "guestSelected", target: ".guestSelected" }],
          on: {
            update_role: {
              actions: [{ type: "update_role", params: ({ event }) => event }],
            },
          },
          states: {
            default: {},
            guestSelected: {
              always: [
                {
                  guard: "isEditorSelected",
                  actions: {
                    type: "update_permission",
                    params: () => ({ value: "viewer" }),
                  },
                },
                {
                  guard: "guestNotSelected",
                  target: "default",
                },
              ],
            },
          },
        },
      },
    },
  },
});

export const useComplexForm = () => useMachine(complexFormMachine);
