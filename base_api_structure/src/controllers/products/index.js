import { success, badRequest, internalServerError } from "../../helpers";

export const getProducts = async (req, res) => {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    success(res, "Products fetched successfully", data);
  } catch (error) {
    internalServerError(res, "Error fetching products");
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    const data = await response.json();
    success(res, "Product fetched successfully", data);
  } catch (error) {
    internalServerError(res, "Error fetching product");
  }
};