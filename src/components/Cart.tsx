import { CartEntry } from "../domains/cart/cart";
import CartItem from "./CartItem";

interface CartProps {
  entries: CartEntry[];
  onDeleteClick: (itemId: number) => void;
}
export default function Cart({ entries, onDeleteClick }: CartProps) {
  return (
    <div>
      <h3>cart</h3>
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
