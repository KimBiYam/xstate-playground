import { Book } from "../domains/book/book";
import { CartEntry } from "../domains/cart/cart";
import BookItem from "./BookItem";

interface BooksProps {
  books: Book[];
  entries: CartEntry[];
  onAddToCartClick: (book: Book) => void;
}
export default function Books({
  books,
  entries,
  onAddToCartClick,
}: BooksProps) {
  const getAmount = (book: Book) => {
    const foundInCart = entries.find((entry) => entry.item.id === book.id);

    if (foundInCart) {
      return book.stock - foundInCart.quantity;
    } else {
      return book.stock;
    }
  };

  return (
    <div>
      <h3>books</h3>
      <ul>
        {books.map((book) => {
          return (
            <BookItem
              key={book.id}
              book={book}
              amount={getAmount(book)}
              onAddToCartClick={onAddToCartClick}
            />
          );
        })}
      </ul>
    </div>
  );
}
