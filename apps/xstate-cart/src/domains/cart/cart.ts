export interface CartItem {
  id: number;
  stock: number;
  price: number;
}

export interface CartEntry {
  item: CartItem;
  quantity: number;
}
