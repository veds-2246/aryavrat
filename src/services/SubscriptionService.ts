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
  const productName =
    subscription.product_name ?? subscription.productName ?? 'Milk';

  return {
    id: String(subscription.id),
    type: 'subscription',
    userId: subscription.user_id ?? subscription.userId,
    addressId: subscription.address_id ?? subscription.addressId,
    productId: subscription.product_id ?? subscription.productId,
    productName,
    quantity: Number(subscription.quantity ?? 0),
    schedule: (subscription.schedule ?? 'daily') as 'daily' | 'custom',
    selectedDays: subscription.selected_days ?? subscription.selectedDays ?? [],
    startDate: subscription.start_date ?? subscription.startDate,
    subscriptionStatus:
      (subscription.status ??
        subscription.subscriptionStatus ??
        'active') as 'active' | 'paused' | 'cancelled',
    nextDeliverySkipped:
      subscription.next_delivery_skipped ?? subscription.nextDeliverySkipped,
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
  const response = await fetch(
    `${API_BASE}/subscriptions/?user_id=${userId}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions');
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(mapSubscriptionFromApi) : [];
}

export async function fetchSubscriptionById(
  subscriptionId: string,
): Promise<UISubscription> {
  const response = await fetch(
    `${API_BASE}/subscriptions/${subscriptionId}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch subscription');
  }

  const data = await response.json();
  return mapSubscriptionFromApi(data);
}

export async function pauseSubscription(subscriptionId: string) {
  const response = await fetch(
    `${API_BASE}/subscriptions/${subscriptionId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'paused',
      }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to pause subscription');
  }

  const data = await response.json();
  return mapSubscriptionFromApi(data);
}

export async function resumeSubscription(subscriptionId: string) {
  const response = await fetch(
    `${API_BASE}/subscriptions/${subscriptionId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'active',
      }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to resume subscription');
  }

  const data = await response.json();
  return mapSubscriptionFromApi(data);
}

export async function cancelSubscription(subscriptionId: string) {
  const response = await fetch(
    `${API_BASE}/subscriptions/${subscriptionId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'cancelled',
      }),
    },
  );

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
  const response = await fetch(
    `${API_BASE}/subscriptions/${subscriptionId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity,
      }),
    },
  );

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
  const response = await fetch(
    `${API_BASE}/subscriptions/${subscriptionId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schedule,
        selected_days: selectedDays,
      }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to update schedule');
  }

  const data = await response.json();
  return mapSubscriptionFromApi(data);
}