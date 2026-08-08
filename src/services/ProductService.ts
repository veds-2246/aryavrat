const API_BASE = 'http://10.0.2.2:8000';

export async function fetchProducts() {
  const response = await fetch(`${API_BASE}/api/v1/products/`);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

export async function fetchProductById(id: string) {
  const response = await fetch(`${API_BASE}/api/v1/products/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  return response.json();
}