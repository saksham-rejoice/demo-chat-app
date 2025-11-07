import { success, badRequest } from "../../helpers";

export const getProducts = async (req, res) => {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    success(req, res, data);
  } catch (error) {
    badRequest(req, res, error, "Error fetching products");
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    const data = await response.json();
    success(req, res, data);
  } catch (error) {
    badRequest(req, res, error, "Error fetching product");
  }
};