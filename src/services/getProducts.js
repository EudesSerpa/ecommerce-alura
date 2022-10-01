import { BASE_URL } from "./settings.js";

export const getProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`[getProducts.js]: ${error}}`);
    throw new Error("[getProducts.js] Error to get products");
  }
};
