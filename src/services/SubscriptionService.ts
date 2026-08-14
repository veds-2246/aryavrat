const API_BASE = 'http://10.0.2.2:8000';

export type BackendSubscription = {
  id: string;
  user_id?: string;
  address_id?: string;
  product_id?: string;
  product_name?: string;
  quantity: number;
  schedule: 'daily' | 'custom';
  selected_days?: string[];
  start_date?: string;
  status?: 'active' | 'paused' | 'cancelled';
  next_delivery_skipped?: boolean;
};

export type UISubscription = {
  id: string;
  type: 'subscription';
  userId?: string;
  addressId?: string;
  productId?: string;
  productName: string;
  quantity: number;
  schedule: 'daily' | 'custom';
  selectedDays?: string[];
  startDate?: string;
  subscriptionStatus: 'active' | 'paused' | 'cancelled';
  nextDeliverySkipped?: boolean;
};

const mapSubscriptionFromApi = (
  subscription: BackendSubscription | Record<string, any>,
): UISubscription => {
  const api = subscription as Record<string, any>;

  const productName = api.product_name ?? api.productName ?? 'Milk';

  return {
    id: String(api.id),
    type: 'subscription',
    userId: api.user_id ?? api.userId,
    addressId: api.address_id ?? api.addressId,
    productId: api.product_id ?? api.productId,
    productName,
    quantity: Number(api.quantity ?? 0),
    schedule: (api.schedule ?? 'daily') as 'daily' | 'custom',
    selectedDays: api.selected_days ?? api.selectedDays ?? [],
    startDate: api.start_date ?? api.startDate,
    subscriptionStatus: (api.status ?? api.subscriptionStatus ?? 'active') as
      | 'active'
      | 'paused'
      | 'cancelled',
    nextDeliverySkipped: api.next_delivery_skipped ?? api.nextDeliverySkipped,
  };
};

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

  const data = await response.json();
  return mapSubscriptionFromApi(data);
}

export async function fetchSubscriptions(userId: string) {
  const response = await fetch(`${API_BASE}/subscriptions/?user_id=${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions');
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(mapSubscriptionFromApi) : [];
}

export async function fetchSubscriptionById(
  subscriptionId: string,
): Promise<UISubscription> {
  const response = await fetch(`${API_BASE}/subscriptions/${subscriptionId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch subscription');
  }

  const data = await response.json();
  return mapSubscriptionFromApi(data);
}

export async function pauseSubscription(subscriptionId: string) {
  const response = await fetch(`${API_BASE}/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'paused',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to pause subscription');
  }

  const data = await response.json();
  return mapSubscriptionFromApi(data);
}

export async function resumeSubscription(subscriptionId: string) {
  const response = await fetch(`${API_BASE}/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'active',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to resume subscription');
  }

  const data = await response.json();
  return mapSubscriptionFromApi(data);
}

export async function cancelSubscription(subscriptionId: string) {
  const response = await fetch(`${API_BASE}/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'cancelled',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }

  const data = await response.json();
  return mapSubscriptionFromApi(data);
}

export async function updateSubscriptionQuantity(
  subscriptionId: string,
  quantity: number,
) {
  const response = await fetch(`${API_BASE}/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quantity,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update quantity');
  }

  const data = await response.json();
  return mapSubscriptionFromApi(data);
}

export async function updateSubscriptionSchedule(
  subscriptionId: string,
  schedule: 'daily' | 'custom',
  selectedDays?: string[],
) {
  const response = await fetch(`${API_BASE}/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      schedule,
      selected_days: selectedDays,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update schedule');
  }

  const data = await response.json();
  return mapSubscriptionFromApi(data);
}
