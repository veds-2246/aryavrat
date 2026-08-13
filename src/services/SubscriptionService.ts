const API_BASE = 'http://10.0.2.2:8000';

export async function createSubscription(subscription: {
  user_id: string;
  address_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  schedule: 'daily' | 'custom';
  selected_days?: string[];
  start_date: string;
}) {
  const response = await fetch(`${API_BASE}/subscriptions/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw new Error('Failed to create subscription');
  }

  return response.json();
}

export async function fetchSubscriptions(userId: string) {
  const response = await fetch(
    `${API_BASE}/subscriptions/?user_id=${userId}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions');
  }

  return response.json();
}