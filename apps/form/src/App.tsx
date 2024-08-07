import "./App.css";
import RadioGroup from "./components/RadioGroup";
import TextField from "./components/TextField";
import { useComplexForm } from "./state/complexFormState";
import { PERMISSIONS, ROLES } from "./types/complexForm";

function App() {
  const [state, send] = useComplexForm();

  const isValid = state.matches({
    age: "valid",
    isForeigner: "valid",
    name: "valid",
    permission: "valid",
    role: "valid",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.alert(JSON.stringify(state.context.values));
      }}
    >
      <TextField
        label="name"
        type="text"
        name="name"
        value={state.context.values.name ?? ""}
        onChange={(e) => send({ type: "update_name", value: e.target.value })}
      />
      <TextField
        label="age"
        type="text"
        name="age"
        value={state.context.values.age ?? ""}
        onChange={(e) => send({ type: "update_age", value: e.target.value })}
      />
      <RadioGroup
        name="role"
        onChange={(_, value) => send({ type: "update_role", value })}
        selectedValue={state.context.values.role ?? "admin"}
        values={ROLES}
      />
      <RadioGroup
        name="permission"
        disabled={state.matches({ role: { valid: "guestSelected" } })}
        onChange={(_, value) => send({ type: "update_permission", value })}
        selectedValue={state.context.values.permission ?? "editor"}
        values={PERMISSIONS}
      />
      <div>
        <label>
          isForeigner
          <input
            disabled={!state.matches({ name: { valid: "containsNonKorean" } })}
            type="checkbox"
            name="isForeigner"
            checked={state.context.values.isForeigner}
            onChange={(e) =>
              send({ type: "update_isForeigner", value: e.target.checked })
            }
          />
        </label>
      </div>
      <button type="submit" disabled={!isValid}>
        submit
      </button>
    </form>
  );
}

export default App;
