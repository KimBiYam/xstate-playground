import { assign, setup } from "xstate";
import { ComplexFormData, Permission, Role } from "../types/complexForm";
import { useMachine } from "@xstate/react";
import { isNumericString } from "../utils/inputUtil";

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
}).createMachine({
  id: "complicatedForm",
  context: {
    values: {
      role: "admin",
      permission: "editor",
      isForeigner: false,
    },
  },
  on: {
    update_name: {
      actions: { type: "update_name", params: ({ event }) => event },
    },
    update_age: {
      guard: ({ event }) => !event.value || isNumericString(event.value),
      actions: { type: "update_age", params: ({ event }) => event },
    },
    update_role: {
      actions: { type: "update_role", params: ({ event }) => event },
    },
    update_permission: {
      actions: { type: "update_permission", params: ({ event }) => event },
    },
    update_isForeigner: {
      actions: { type: "update_isForeigner", params: ({ event }) => event },
    },
  },
});

export const useComplexForm = () => useMachine(complexFormMachine);
