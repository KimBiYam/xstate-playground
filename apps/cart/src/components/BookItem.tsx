import { Book } from "../domains/book/book";

interface BookItemProps {
  book: Book;
  amount: number;
  onAddToCartClick: (book: Book) => void;
}
export default function BookItem({
  book,
  amount,
  onAddToCartClick,
}: BookItemProps) {
  const { id, name, price } = book;

  return (
    <li>
      <p>id: {id}</p>
      <p>name: {name}</p>
      <p>price: {price}</p>
      <p>amount: {amount}</p>
      <button disabled={!amount} onClick={() => onAddToCartClick(book)}>
        add to cart
      </button>
    </li>
  );
}
