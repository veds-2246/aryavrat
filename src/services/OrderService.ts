const API_BASE = 'http://10.0.2.2:8000';

export async function createOrder(order: {
  product_id: string;
  product_name: string;
  quantity: number;
  price_per_unit: number;
  total_amount: number;
  delivery_date: string;
  delivery_address: string;
  type: string;
}) {
  const response = await fetch(`${API_BASE}/api/v1/orders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error('Failed to create order');
  }

  return response.json();
}

export async function fetchOrders() {
  const response = await fetch(`${API_BASE}/api/v1/orders/`);

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
}