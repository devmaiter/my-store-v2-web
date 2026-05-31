import type {
  ApiError,
  Category,
  Order,
  Product,
  ProductList,
  User,
} from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3010/api/v1';

class ApiClientError extends Error {
  readonly status: number;
  readonly payload: ApiError;
  constructor(payload: ApiError) {
    super(payload.message);
    this.status = payload.statusCode;
    this.payload = payload;
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers, ...rest } = init;
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) throw new ApiClientError(body as ApiError);
  return body as T;
}

export const api = {
  // products
  listProducts: (q: { limit?: number; offset?: number; minPrice?: number; maxPrice?: number } = {}) => {
    const sp = new URLSearchParams();
    Object.entries(q).forEach(([k, v]) => v !== undefined && sp.set(k, String(v)));
    return request<ProductList>(`/products${sp.toString() ? `?${sp}` : ''}`);
  },
  getProduct: (id: number | string) => request<Product>(`/products/${id}`),

  // categories
  listCategories: () => request<Category[]>('/categories'),
  getCategory: (id: number | string) => request<Category>(`/categories/${id}`),

  // auth
  register: (body: { email: string; password: string }) =>
    request<{ id: number; email: string; role: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<{ user: { id: number; email: string; role: string }; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  me: (token: string) => request<{ user: User }>('/auth/me', { token }),

  // orders
  createOrder: (token: string, items: Array<{ productId: number; amount: number }>) =>
    request<Order>('/orders', {
      method: 'POST',
      token,
      body: JSON.stringify({ items }),
    }),
  myOrders: (token: string) => request<Order[]>('/orders/me', { token }),
};

export { ApiClientError };
