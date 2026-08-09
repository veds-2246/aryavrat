const API_BASE = 'http://10.0.2.2:8000';

export async function createOrGetUser(
  phone: string,
  name?: string,
) {
  const response = await fetch(
    `${API_BASE}/api/v1/users/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        name,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      'Failed to create or fetch user',
    );
  }

  return response.json();
}