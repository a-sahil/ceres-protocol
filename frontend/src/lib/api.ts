import { IWarehouse } from "./types"; // We will create this type definition file next

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =================================
// USER AUTHENTICATION API
// =================================

// User Signup Function
export const signupUser = async (userData: any) => {
  const response = await fetch(`${BASE_URL}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to sign up');
  }
  return response.json();
};

// User Login Function
export const loginUser = async (credentials: any) => {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to log in');
  }
  return response.json();
};


// =================================
// WAREHOUSE API
// =================================

// Warehouse Registration Function
export const registerWarehouse = async (warehouseData: FormData) => {
  const authToken = localStorage.getItem('authToken'); // Assuming you protect this route later

  const response = await fetch(`${BASE_URL}/warehouses/register`, {
    method: 'POST',
    // Do NOT set Content-Type header for FormData, the browser does it automatically with the correct boundary
    body: warehouseData,
    // headers: {
    //   'Authorization': `Bearer ${authToken}`, // Example for protected routes
    // },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to register warehouse');
  }
  return response.json();
};

export const getAllWarehouses = async () => {
  const response = await fetch(`${BASE_URL}/warehouses`);
  if (!response.ok) {
    throw new Error('Failed to fetch warehouses');
  }
  return response.json();
};

// ADD THIS NEW FUNCTION
export const getWarehouseDetails = async (id: string) => {
  const response = await fetch(`${BASE_URL}/warehouses/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch warehouse details');
  }
  return response.json();
};

// --- THIS IS THE UPDATED FUNCTION ---
interface BookingPayload {
  cropType: string;
  cropQuantity: number;
  duration: number;
  insurance: boolean;
  transactionHash: string;
}

export const bookWarehouse = async (id: string, data: BookingPayload) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('You must be logged in to book a warehouse.');
  }

  // The URL is constructed here. 'id' MUST be a string.
  const response = await fetch(`${BASE_URL}/warehouses/${id}/book`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to finalize booking on the server');
  }
  return response.json();
};