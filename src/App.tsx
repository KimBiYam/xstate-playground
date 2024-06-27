import "./App.css";
import { useCart } from "./state/cartState";

function App() {
  const [state, send] = useCart();
  console.log("state", state);

  return (
    <div>
      <h3>status: {state.status}</h3>
      <button
        onClick={() =>
          send({ type: "addItem", item: { id: 1, price: 1, stock: 1 } })
        }
      >
        add test item
      </button>
      <ul>
        {state.context.entries.map((entry) => (
          <li key={entry.item.id}>
            <p>id: {entry.item.id}</p>
            <p>quantity: {entry.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
