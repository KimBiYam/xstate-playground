import { assign, enqueueActions, setup } from "xstate";
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

type ComplicatedFormEvents = OnChangeEvent<keyof ComplexFormData>;

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
    invalidName: ({ context }) => !context.values.name,
    guestSelected: ({ context }) => context.values.role === "guest",
    guestNotSelected: ({ context }) => context.values.role !== "guest",
    isEditorSelected: ({ context }) => context.values.permission === "editor",
  },
}).createMachine({
  id: "complicatedForm",
  context: {
    values: {
      role: "admin",
      permission: "editor",
      isForeigner: false,
    },
  },
  type: "parallel",
  states: {
    age: {
      initial: "invalid",
      on: {
        update_age: {
          guard: ({ event }) => !event.value || isNumericString(event.value),
          actions: { type: "update_age", params: ({ event }) => event },
        },
      },
      states: {
        invalid: {
          always: {
            guard: ({ context }) => typeof context.values.age === "number",
            target: "valid",
          },
        },
        valid: {
          always: {
            guard: ({ context }) => context.values.age === undefined,
            target: "invalid",
          },
        },
      },
    },
    permission: {
      initial: "valid",
      on: {
        update_permission: {
          actions: {
            type: "update_permission",
            params: ({ event }) => event,
          },
        },
      },
      states: {
        valid: {},
      },
    },
    isForeigner: {
      initial: "valid",
      on: {
        update_isForeigner: {
          actions: {
            type: "update_isForeigner",
            params: ({ event }) => event,
          },
        },
      },
      states: {
        valid: {},
      },
    },
    name: {
      initial: "invalid",
      on: {
        update_name: {
          actions: [
            {
              type: "update_name",
              params: ({ event }) => event,
            },
            enqueueActions(({ enqueue, check }) => {
              if (check({ type: "notContainsNonKorean" })) {
                enqueue({
                  type: "update_isForeigner",
                  params: () => ({ value: false }),
                });
              }
            }),
          ],
        },
      },
      states: {
        valid: {
          always: {
            guard: ({ context }) => !context.values.name,
            target: "invalid",
          },
          initial: "default",
          states: {
            default: {
              always: {
                guard: "containsNonKorean",
                target: "containsNonKorean",
              },
            },
            containsNonKorean: {
              always: {
                guard: "notContainsNonKorean",
                target: "default",
              },
            },
          },
        },
        invalid: {
          always: {
            guard: ({ context }) => !!context.values.name,
            target: "valid",
          },
        },
      },
    },
    role: {
      initial: "valid",
      on: {
        update_role: {
          actions: [
            { type: "update_role", params: ({ event }) => event },
            enqueueActions(({ enqueue, check }) => {
              if (check({ type: "guestSelected" })) {
                enqueue({
                  type: "update_permission",
                  params: () => ({ value: "viewer" }),
                });
              }
            }),
          ],
        },
      },
      states: {
        valid: {
          initial: "default",
          states: {
            default: {
              always: { guard: "guestSelected", target: "guestSelected" },
            },
            guestSelected: {
              always: { guard: "guestNotSelected", target: "default" },
            },
          },
        },
      },
    },
  },
});

export const useComplexForm = () => useMachine(complexFormMachine);
