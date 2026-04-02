import axios from "axios";
import { useAuthStore } from "./state";

const BASE_URL = "http://localhost:8080/api/v1";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Jika unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ⭐ Call refresh endpoint
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = res.data.accessToken;

        // Simpan token baru
        useAuthStore.getState().setAccessToken(newToken);

        // Update header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry request lama
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh gagal → logout
        useAuthStore.getState().logout();

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
export const APIRegister = async (data: RegisterData) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, data);
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err.message;
  }
};

export const APIlogin = async (data: LoginData) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, data);
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err.message;
  }
};
// export const APIme = async () => {
//   try {
//     const res = await axios.get(`${BASE_URL}me`, { withCredentials: true });
//     return res.data;
//   } catch (err: any) {
//     throw err.response?.data || err.message;
//   }
// };
export const APIlogout = async () => {
  try {
    const res = await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      { withCredentials: true },
    );
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err.message;
  }
};

// export const APICreateRole = async (data: ElementData) => {
//   try {
//     const res = await axios.post(`${BASE_URL}/roles`, data);
//     return res.data;
//   } catch (err: any) {
//     throw err.response?.data || err.message;
//   }
// };
// export const APICreateHaris = async (data: ElementData) => {
//   try {
//     const res = await axios.post(`${BASE_URL}/haris`, data);
//     return res.data;
//   } catch (err: any) {
//     throw err.response?.data || err.message;
//   }
// };
