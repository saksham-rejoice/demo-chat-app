import apiClient from "./apiClient";
import apiEndpoints from "./endpoint";
import { Product, ProductListResponse } from "@/types/product";

export const ProductList = async (): Promise<ProductListResponse> => {
  try {
    const response = await fetch('https://dummyjson.com/products');
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};
export const ProductListDetails = async (id: string): Promise<Product> => {
  try {
    // const response = await apiClient.get(
    //   `  ${apiEndpoints.product.details}/${id}`
    // );
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    const result = await response.json();
    return result;
    //return response.data;
  } catch (error) {
    throw error;
  }
};


