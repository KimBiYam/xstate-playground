import { CartEntry } from "../domains/cart/cart";
import CartItem from "./CartItem";

interface CartProps {
  entries: CartEntry[];
  isFull: boolean;
  onDeleteClick: (itemId: number) => void;
}
export default function Cart({ entries, isFull, onDeleteClick }: CartProps) {
  return (
    <div>
      <h3>cart</h3>
      {isFull && <h4>cart is full!!</h4>}
      <ul>
        {entries.map((entry) => (
          <CartItem
            key={entry.item.id}
            entry={entry}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </ul>
    </div>
  );
}
