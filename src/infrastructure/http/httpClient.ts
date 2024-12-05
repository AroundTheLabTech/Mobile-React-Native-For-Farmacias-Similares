import { ApiResponse } from '@domain/models/ApiResponse';
import { UserAuth } from '@domain/models/User';
import { BACKEND_BASE_URL } from '@env';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Función para realizar solicitudes GET
export const httpClientGet = async (endpoint: string) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const result = await response.json();
    return result as ApiResponse<UserAuth>;
  } catch (error) {
    throw new Error(`Error en la solicitud GET: ${error.message}`);
  }
};

// Función para realizar solicitudes POST
export const httpClientPost = async (endpoint: string, body: object) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const result: ApiResponse<UserAuth> = await response.json();
    return result as ApiResponse<UserAuth>;
  } catch (error) {
    throw new Error(`Error en la solicitud POST: ${error.message}`);
  }
};

// Puedes agregar más funciones como PUT, DELETE, etc., de manera similar.
