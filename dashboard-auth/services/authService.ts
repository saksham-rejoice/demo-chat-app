import apiClient from "./apiClient";
import apiEndpoints from "./endpoint";
import { toast } from "sonner";

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post(apiEndpoints.auth.login, {
      email,
      password,
    });
    const { accessToken, user } = response.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    toast.success('Login successful!');
    window.location.href = '/dashboard';
    return response.data.data.message;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Login failed');
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  toast.success("Logged out successfully");
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await apiClient.post(apiEndpoints.auth.register, {
      username,
      email,
      password,
    });
    return response.data.message;
  } catch (error) {
    throw error;
  }
};
