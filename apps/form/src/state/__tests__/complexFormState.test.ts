import { act, renderHook } from "@testing-library/react";
import { useComplexForm } from "../complexFormState";

describe("complexFormState", () => {
  const prepare = () => renderHook(() => useComplexForm());

  describe("age", () => {
    it("should initial state is invalid", () => {
      // given
      const { result } = prepare();
      const [state] = result.current;

      // when
      // then
      expect(state.matches({ age: "invalid" })).toBe(true);
      expect(state.context.values.age).toBeUndefined();
    });

    it("should ignore not numeric string", () => {
      // given
      const { result } = prepare();
      const [_, send] = result.current;

      // when
      act(() => {
        send({ type: "update_age", value: "test" });
      });

      // then
      const [state] = result.current;
      expect(state.context.values.age).toBeUndefined();
    });

    it("should change to valid state and set age", () => {
      // given
      const { result } = prepare();
      const [_, send] = result.current;

      // when
      act(() => {
        send({ type: "update_age", value: "111" });
      });

      // then
      const [state] = result.current;
      expect(state.context.values.age).toBe(111);
      expect(state.matches({ age: "valid" })).toBe(true);
    });
  });

  describe("permission", () => {
    it("should initial state is valid and set default value", () => {
      // given
      const { result } = prepare();
      const [state] = result.current;

      // when
      // then
      expect(state.matches({ permission: "valid" })).toBe(true);
      expect(state.context.values.permission).toBe("editor");
    });

    it("should change permission", () => {
      // given
      const { result } = prepare();
      const [_, send] = result.current;

      // when
      act(() => {
        send({ type: "update_permission", value: "viewer" });
      });

      // then
      const [state] = result.current;
      expect(state.context.values.permission).toBe("viewer");
    });
  });

  describe("isForeigner", () => {
    it("should initial state is valid and set default value", () => {
      // given
      const { result } = prepare();
      const [state] = result.current;

      // when
      // then
      expect(state.matches({ isForeigner: "valid" })).toBe(true);
      expect(state.context.values.isForeigner).toBe(false);
    });

    it("should change isForeigner", () => {
      // given
      const { result } = prepare();
      const [_, send] = result.current;

      // when
      act(() => {
        send({ type: "update_isForeigner", value: true });
      });

      // then
      const [state] = result.current;
      expect(state.context.values.isForeigner).toBe(true);
    });
  });

  describe("name", () => {
    it("should initial state is invalid", () => {
      // given
      const { result } = prepare();
      const [state] = result.current;

      // when
      // then
      expect(state.matches({ name: "invalid" })).toBe(true);
      expect(state.context.values.name).toBeUndefined();
    });

    it("should change to valid state and set name", () => {
      // given
      const { result } = prepare();
      const [_, send] = result.current;

      // when
      act(() => {
        send({ type: "update_name", value: "test" });
      });

      // then
      const [state] = result.current;
      expect(state.matches({ name: "valid" })).toBe(true);
      expect(state.context.values.name).toBe("test");
    });

    it("should isForeigner context to false when not contains non Korean", () => {
      // given
      const { result } = prepare();
      const [_, send] = result.current;

      // when
      act(() => {
        send({ type: "update_isForeigner", value: true });
        send({ type: "update_name", value: "한글" });
      });

      // then
      const [state] = result.current;
      expect(state.context.values.isForeigner).toBe(false);
    });

    it("should change to containsNonKorean state", () => {
      // given
      const { result } = prepare();
      const [_, send] = result.current;

      // when
      act(() => {
        send({ type: "update_name", value: "test" });
      });

      // then
      const [state] = result.current;
      expect(state.matches({ name: { valid: "containsNonKorean" } })).toBe(
        true
      );
    });
  });

  describe("role", () => {
    it("should initial state is valid and set default value", () => {
      // given
      const { result } = prepare();
      const [state] = result.current;

      // when
      // then
      expect(state.matches({ role: "valid" })).toBe(true);
      expect(state.context.values.role).toBe("admin");
    });

    it("should change role", () => {
      // given
      const { result } = prepare();
      const [_, send] = result.current;

      // when
      act(() => {
        send({ type: "update_role", value: "guest" });
      });

      // then
      const [state] = result.current;
      expect(state.context.values.role).toBe("guest");
    });

    it("should change permission to viewer when guest selected", () => {
      // given
      const { result } = prepare();
      const [_, send] = result.current;

      // when
      act(() => {
        send({ type: "update_permission", value: "editor" });
        send({ type: "update_role", value: "guest" });
      });

      // then
      const [state] = result.current;
      expect(state.context.values.permission).toBe("viewer");
    });
  });
});
