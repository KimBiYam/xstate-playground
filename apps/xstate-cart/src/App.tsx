import "./App.css";
import Books from "./components/Books";
import Cart from "./components/Cart";
import { booksFixture } from "./fixtures/booksFixture";
import { useCart } from "./state/cartState";

const books = booksFixture;

function App() {
  const [state, send] = useCart();

  return (
    <div>
      <Books
        books={books}
        entries={state.context.entries}
        onAddToCartClick={(item) => send({ type: "addItem", item })}
      />
      <hr />
      <Cart
        entries={state.context.entries}
        isFull={state.value === "isFull"}
        onDeleteClick={(itemId) => send({ type: "removeItem", itemId })}
      />
    </div>
  );
}

export default App;
