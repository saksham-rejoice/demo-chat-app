import apiClient from "./apiClient";
import apiEndpoints from "./endpoint";
import { toast } from "sonner";

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post(apiEndpoints.auth.login, {
      email,
      password,
    });
    const { accessToken, refreshToken, user, message } = response.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    
    // Set cookie for middleware
    document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
    
    toast.success("Login successful!");
    window.location.href = "/dashboard";
    return message;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Login failed");
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  
  // Clear cookie
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  
  toast.success("Logged out successfully");
  window.location.href = "/login";
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
    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post(apiEndpoints.auth.refresh, {
      refreshToken,
    });
    
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    
    return accessToken;
  } catch (error) {
    logout();
    window.location.href = "/login";
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const response = await apiClient.get(apiEndpoints.auth.user);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch user data";
  }
};
