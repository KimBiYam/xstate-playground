import { CartEntry } from "../domains/cart/cart";

interface CartItemProps {
  entry: CartEntry;
  onDeleteClick: (itemId: number) => void;
}
export default function CartItem({ entry, onDeleteClick }: CartItemProps) {
  return (
    <li key={entry.item.id}>
      <p>id: {entry.item.id}</p>
      <p>quantity: {entry.quantity}</p>
      <button onClick={() => onDeleteClick(entry.item.id)}>delete item</button>
    </li>
  );
}
