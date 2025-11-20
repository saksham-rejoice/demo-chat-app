import apiClient from "./apiClient";
import apiEndpoints from "./endpoint";
import { Product, ProductListResponse } from "@/types/product";

export const ProductList = async (): Promise<ProductListResponse> => {
  try {
    const response = await apiClient.get(apiEndpoints.product.list);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const ProductListDetails = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.product.details}/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};


