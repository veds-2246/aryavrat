const API_BASE = 'http://10.0.2.2:8000';

export type Address = {
  id?: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
};

export async function fetchAddresses(userId: string) {
  const response = await fetch(
    `${API_BASE}/api/v1/addresses?user_id=${userId}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch addresses');
  }

  const data = await response.json();

  return data.map((addr: any) => ({
    id: addr.id,
    label: addr.label,
    fullName: addr.full_name,
    phone: addr.phone,
    house: addr.address_line,
    area: addr.city,
    landmark: addr.landmark ?? '',
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    isDefault: addr.is_default,
  }));
}
export async function createAddress(address: Address) {
  const response = await fetch(`${API_BASE}/api/v1/addresses/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(address),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log('Address API error:', data);
    throw new Error(JSON.stringify(data));
  }

  return data;
}

export async function updateAddress(id: string, address: Partial<Address>) {
  const response = await fetch(`${API_BASE}/api/v1/addresses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(address),
  });

  if (!response.ok) {
    throw new Error('Failed to update address');
  }

  return response.json();
}

export async function deleteAddress(id: string) {
  const response = await fetch(`${API_BASE}/api/v1/addresses/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete address');
  }

  return response.json();
}

export async function fetchAddressById(addressId: string) {
  const response = await fetch(`${API_BASE}/api/v1/addresses/${addressId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch address');
  }

  const data = await response.json();

  return {
    id: data.id,
    fullName: data.full_name,
    phone: data.phone,
    house: data.address_line,
    area: data.city,
    landmark: data.landmark ?? '',
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    label: data.label,
    isDefault: data.is_default,
  };
}
