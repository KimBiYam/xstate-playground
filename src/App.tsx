import "./App.css";
import { useCart } from "./state/cartState";

function App() {
  const [state, send] = useCart();
  console.log("state", state);

  return <div></div>;
}

export default App;
