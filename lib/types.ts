export type User = {
  sub: number;
  email: string;
  role: 'customer' | 'admin';
};

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string | null;
  description: string | null;
  isBlocked: boolean;
  categoryId: number | null;
  createdAt: string;
};

export type ProductList = {
  items: Product[];
  total: number;
  limit: number;
  offset: number;
};

export type Category = {
  id: number;
  name: string;
  image: string | null;
  createdAt: string;
  products?: Product[];
};

export type OrderItem = Product & {
  OrderProduct: { amount: number };
};

export type Order = {
  id: number;
  userId: number;
  total: number;
  createdAt: string;
  user?: { id: number; email: string; role: string };
  items: OrderItem[];
};

export type ApiError = {
  statusCode: number;
  error: string;
  message: string;
  details?: { issues: Array<{ path: string; message: string }> };
};
