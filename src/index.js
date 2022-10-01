import { $ } from "./helpers/getElement.js";
import { validationForm } from "./helpers/form-validation.js";
import { toggleMenu } from "./funcionalities/header/hamburger-menu.js";
import { toggleForm } from "./funcionalities/header/search-form.js";
import Carousel from "./funcionalities/carousel/index.js";
import { renderProducts } from "./components/Product/index.js";

// Header
$(".header__hamburger").addEventListener("click", toggleMenu);
$(".btn-search--mobile").addEventListener("click", toggleForm);

// Carousel
document
  .querySelectorAll(".carousel")
  .forEach((carousel) => new Carousel(carousel));

// Products
const listProducts = document.querySelectorAll(".products__grid");

listProducts.forEach((listNode) => {
  renderProducts({ element: listNode, category: listNode.dataset?.category });
});

// Contact form validation
validationForm({
  formElement: $(".contact__form"),
  successMessage: "Message sent successfully!",
  failMesssage: "Message not sent! Check the form and correct it.",
});
