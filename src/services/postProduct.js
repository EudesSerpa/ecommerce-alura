import { BASE_URL } from "./settings.js";

export const postProduct = async (product) => {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ ...product }),
    });

    if (!response.ok) {
      throw new Error(
        "[postProduct] Error: Something went wrong to create product"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
