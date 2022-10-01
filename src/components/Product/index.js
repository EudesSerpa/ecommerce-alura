import { getProducts } from "../../services/getProducts.js";

export const renderProducts = async ({ element, category }) => {
  try {
    const products = await getProducts();

    let productsFiltered = products;

    if (category) {
      productsFiltered = products.filter(
        (product) => product.category === category
      );
    }

    element.innerHTML = productsFiltered.map(productItem).join("");
  } catch (_error) {
    element.innerHTML = `<li>Something went wrong to get products</li>`;
  }
};

const productItem = ({ name, price, description, imageUrl }) => {
  return `
    <li class="product__item">
      <a href="#" class="product" aria-label="See product">
        <figure class="product-container">
          <div class="product__image-container">
            <img
              class="product__image"
              src=${imageUrl}
              alt=${name}
              width="164"
              height="174"
            />
          </div>

          <figcaption class="product__description">
            <h4 class="product__title">${name}</h4>
            <p class="product__text">${description}</p>

            <p class="product__price">$ ${price}</p>
            <button class="product__cta">
              <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
              <span>Add to cart</span>
            </button>
          </figcaption>
        </figure>
      </a>
    </li>
  `;
};
