import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useAuthStore } from "./state";
import axios from "axios";

export interface MetaData {
  code: number;
  status: string;
  data: [];
}
export interface ElementData {
  nama: string;
}

const BASE_URL = "http://localhost:8080/api/v1";
const size = 10;

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

  (error) => {
    console.log("error");
    if (error?.status === 401) {
      // logout state
      useAuthStore.getState().logout();

      // redirect login
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  },
);

/** fetch for get all divisi */
export const useDivisi = () => {
  const responses = useQuery<MetaData, Error, unknown, string[]>({
    queryKey: ["divisis"],
    queryFn: async () => {
      const response = await api.get(`${BASE_URL}/divisis`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
        // credentials: "include",
      });
      return response.data;
    },
  });

  return responses;
};

export const useCreateDivisi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ElementData) => {
      const res = await api.post(`${BASE_URL}/divisis`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisis"] });
    },
  });
};

export const useUpdateDivisi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ElementData }) => {
      const res = await api.put(`${BASE_URL}/divisis/${id}`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisis"] });
    },
  });
};

export const useDeleteDivisi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`${BASE_URL}/divisis/${id}`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisis"] });
    },
  });
};
/** fetch for get all role */
export const useRole = () => {
  const responses = useQuery<MetaData, Error, unknown, string[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await api.get(`${BASE_URL}/roles/get`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
        // credentials: "include",
      });
      return response.data;
    },
  });

  return responses;
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ElementData) => {
      const res = await api.post(`${BASE_URL}/roles`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ElementData }) => {
      const res = await api.put(`${BASE_URL}/roles/${id}`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`${BASE_URL}/roles/${id}`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
/** fetch for get all hari */
export const useHari = () => {
  const responses = useQuery<MetaData, Error, unknown, string[]>({
    queryKey: ["haris"],
    queryFn: async () => {
      const response = await api.get(`${BASE_URL}/haris`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
        // credentials: "include",
      });

      // if (!response.ok) {
      //   const text = await response.text(); // penting
      //   console.error("API ERROR:", response.status, text);
      //   throw new Error(`HTTP ${response.status}`);
      // }

      const data = await response.data;
      return data;
    },
  });

  return responses;
};

export const useCreateHari = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ElementData) => {
      const res = await api.post(`${BASE_URL}/haris`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["haris"] });
    },
  });
};

export const useUpdateHari = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ElementData }) => {
      const res = await api.put(`${BASE_URL}/haris/${id}`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["haris"] });
    },
  });
};

export const useDeleteHari = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`${BASE_URL}/haris/${id}`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["haris"] });
    },
  });
};
/** fetch for get all users */
export const useUsers = (page: Number, size: Number, search: String) => {
  const querySearch = search !== "" ? `&search=${search}` : "";
  const responses = useQuery<MetaData, Error, unknown, string[]>({
    queryKey: ["users", page.toString(), search.toString()],
    queryFn: async () => {
      const response = await api.get(
        `${BASE_URL}/users?page=${page}&size=${size}${querySearch}`,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
          // credentials: "include",
        },
      );
      return response.data;
    },
  });

  return responses;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`${BASE_URL}/users`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await api.put(`${BASE_URL}/users/${id}`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`${BASE_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/** fetch for get all mentor */
export const useMentor = (users: any) => {
  const responses = useQuery<MetaData, Error, unknown, string[]>({
    queryKey: ["mentors", users],
    queryFn: async () => {
      const response = await api.get(`${BASE_URL}/users/role/Validator`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
        // credentials: "include",
      });
      return response.data;
    },
  });

  return responses;
};
/** fetch for get all mentee */
export const useMentee = () => {
  const responses = useQuery<MetaData, Error, unknown, string[]>({
    queryKey: ["mentees"],
    queryFn: async () => {
      const response = await api.get(`${BASE_URL}/users/role/Mentee`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
        // credentials: "include",
      });
      return response.data;
    },
  });

  return responses;
};

/** fetch for get all shifts */
export const useShifts = (page: Number, search: String) => {
  const querySearch = search ? `&search=${search}` : "";
  const responses = useQuery<MetaData, Error, unknown, string[]>({
    queryKey: ["shifts", page.toString(), search.toString()],
    queryFn: async () => {
      const response = await api.get(
        `${BASE_URL}/shifts?page=${page}&size=${size}${querySearch}`,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
          // credentials: "include",
        },
      );
      return response.data;
    },
  });

  return responses;
};
export const useShiftByUser = (userId: number) => {
  const responses = useQuery<MetaData, Error, unknown, string[]>({
    queryKey: ["shifts", userId.toString()],
    queryFn: async () => {
      const response = await api.get(`${BASE_URL}/shifts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
        // credentials: "include",
      });
      return response.data;
    },
  });

  return responses;
};

export const useCreateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`${BASE_URL}/shifts`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
};

export const useUpdateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await api.put(`${BASE_URL}/shifts/${id}`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
};

export const useDeleteShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`${BASE_URL}/shifts/${id}`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
};

/** fetch for get all absensis */
export const useAbsensis = (page: Number, search: String) => {
  const querySearch = search ? `&search=${search}` : "";
  const responses = useQuery<MetaData, Error, unknown, string[]>({
    queryKey: ["absensis", page.toString(), search.toString()],
    queryFn: async () => {
      const response = await api.get(
        `${BASE_URL}/absensis?page=${page}&size=${size}&${querySearch}`,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
          // credentials: "include",
        },
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  return responses;
};
export const useAbsensiByUser = (userId: number, page: Number) => {
  // const querySearch = search ? `&search=${search}` : "";
  const responses = useQuery<MetaData, Error, unknown, string[]>({
    queryKey: ["absensis", page.toString()],
    queryFn: async () => {
      const response = await api.get(
        `${BASE_URL}/absensis/user/${userId}?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
          // credentials: "include",
        },
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  return responses;
};
export const useAbsensiByMentor = (
  mentorId: number,
  page: Number,
  search: String,
) => {
  const querySearch = search ? `&search=${search}` : "";
  const responses = useQuery<MetaData, Error, unknown, string[]>({
    queryKey: [
      "absensis",
      mentorId.toString(),
      page.toString(),
      search.toString(),
    ],
    queryFn: async () => {
      const response = await api.get(
        `${BASE_URL}/absensis/mentor/${mentorId}?page=${page}&size=${size}${querySearch}`,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
          // credentials: "include",
        },
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  return responses;
};
export const useAbsensiByIsPrivate = (
  n: Boolean,
  page: Number,
  search: String,
) => {
  const querySearch = search ? `&search=${search}` : "";
  const responses = useQuery<MetaData, Error, unknown, string[]>({
    queryKey: ["absensis", page.toString(), search.toString()],
    queryFn: async () => {
      const response = await api.get(
        `${BASE_URL}/absensis/isPrivate/${n}?page=${page}&size=${size}${querySearch}`,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
          // credentials: "include",
        },
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  return responses;
};

export const useCreateAbsensi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`${BASE_URL}/absensis`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["absensis"] });
    },
  });
};

export const useUpdateAbsensi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await api.put(`${BASE_URL}/absensis/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["absensis"] });
    },
  });
};
export const useApprovalAbsensi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, id }: { id: number; data: any }) => {
      const res = await api.put(`${BASE_URL}/absensis/approval/${id}`, data, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["absensis"] });
    },
  });
};

export const useDeleteAbsensi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`${BASE_URL}/absensis/${id}`, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["absensis"] });
    },
  });
};
