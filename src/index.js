import { $ } from "./utils/getElement.js";
import { toggleMenu } from "./funcionalities/header/hamburger-menu.js";
import { toggleForm } from "./funcionalities/header/search-form.js";

// Header
$(".header__hamburger").addEventListener("click", toggleMenu);
$(".btn-search--mobile").addEventListener("click", toggleForm);

// Carousel
import Carousel from "./funcionalities/carousel/index.js";

document
  .querySelectorAll(".carousel")
  .forEach((carousel) => new Carousel(carousel));
