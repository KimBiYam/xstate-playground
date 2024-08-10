import { complexFormMachine } from "../complexFormState";
import { createActor } from "xstate";

describe("complexFormState", () => {
  let actor: ReturnType<typeof createActor<typeof complexFormMachine>>;

  beforeEach(() => {
    actor = createActor(complexFormMachine);
  });

  describe("age", () => {
    it("should initial state is invalid", () => {
      // given
      actor.start();

      // when
      // then
      expect(actor.getSnapshot().matches({ age: "invalid" })).toBe(true);
      expect(actor.getSnapshot().context.values.age).toBeUndefined();
    });

    it("should ignore not numeric string", () => {
      // given
      actor.start();

      // when
      actor.send({ type: "update_age", value: "test" });

      // then
      expect(actor.getSnapshot().context.values.age).toBeUndefined();
    });

    it("should change to valid state and set age", () => {
      // given
      actor.start();

      // when
      actor.send({ type: "update_age", value: "111" });

      // then
      expect(actor.getSnapshot().context.values.age).toBe(111);
      expect(actor.getSnapshot().matches({ age: "valid" })).toBe(true);
    });
  });

  describe("permission", () => {
    it("should initial state is valid and set default value", () => {
      // given
      actor.start();

      // when
      // then
      expect(actor.getSnapshot().matches({ permission: "valid" })).toBe(true);
      expect(actor.getSnapshot().context.values.permission).toBe("editor");
    });

    it("should change permission", () => {
      // given
      actor.start();

      // when
      actor.send({ type: "update_permission", value: "viewer" });

      // then
      expect(actor.getSnapshot().context.values.permission).toBe("viewer");
    });
  });

  describe("isForeigner", () => {
    it("should initial state is valid and set default value", () => {
      // given
      actor.start();

      // when
      // then
      expect(actor.getSnapshot().matches({ isForeigner: "valid" })).toBe(true);
      expect(actor.getSnapshot().context.values.isForeigner).toBe(false);
    });

    it("should change isForeigner", () => {
      // given
      actor.start();

      // when
      actor.send({ type: "update_isForeigner", value: true });

      // then
      expect(actor.getSnapshot().context.values.isForeigner).toBe(true);
    });
  });

  describe("name", () => {
    it("should initial state is invalid", () => {
      // given
      actor.start();

      // when
      // then
      expect(actor.getSnapshot().matches({ name: "invalid" })).toBe(true);
      expect(actor.getSnapshot().context.values.name).toBeUndefined();
    });

    it("should change to valid state and set name", () => {
      // given
      actor.start();

      // when
      actor.send({ type: "update_name", value: "test" });

      // then
      expect(actor.getSnapshot().matches({ name: "valid" })).toBe(true);
      expect(actor.getSnapshot().context.values.name).toBe("test");
    });

    it("should isForeigner context to false when not contains non Korean", () => {
      // given
      actor.start();

      // when
      actor.send({ type: "update_isForeigner", value: true });
      actor.send({ type: "update_name", value: "한글" });

      // then
      expect(actor.getSnapshot().context.values.isForeigner).toBe(false);
    });

    it("should change to containsNonKorean state", () => {
      // given
      actor.start();

      // when
      actor.send({ type: "update_name", value: "test" });

      // then
      expect(
        actor.getSnapshot().matches({ name: { valid: "containsNonKorean" } })
      ).toBe(true);
    });
  });

  describe("role", () => {
    it("should initial state is valid and set default value", () => {
      // given
      actor.start();

      // when
      // then
      expect(actor.getSnapshot().matches({ role: "valid" })).toBe(true);
      expect(actor.getSnapshot().context.values.role).toBe("admin");
    });

    it("should change role", () => {
      // given
      actor.start();

      // when
      actor.send({ type: "update_role", value: "guest" });

      // then
      expect(actor.getSnapshot().context.values.role).toBe("guest");
    });

    it("should change permission to viewer when guest selected", () => {
      // given
      actor.start();

      // when
      actor.send({ type: "update_permission", value: "editor" });
      actor.send({ type: "update_role", value: "guest" });

      // then
      expect(actor.getSnapshot().context.values.permission).toBe("viewer");
    });
  });
});
