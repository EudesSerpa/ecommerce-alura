// Menu mobile
const hamburgerMenuIcon = document.querySelector(".header__hamburger");
const headerMenuList = document.querySelector(".header__nav-list");
const headerNav = document.querySelector(".header__nav");

const closeMenuBySelection = ({ target }) => {
  if (target.tagName !== "A") return;

  toggleMenu();
};

const closeMenuWithEscapeKey = (e) => {
  if (!hamburgerMenuIcon.classList.contains("open")) return;

  if (e.key === "Escape") {
    toggleMenu();
    hamburgerMenuIcon.focus();
  }
};

const toggleMenu = () => {
  // Open/Close
  const isOpen = hamburgerMenuIcon.classList.toggle("open");
  hamburgerMenuIcon.setAttribute("aria-expanded", isOpen);
  headerNav.classList.toggle("open");

  if (isOpen) {
    hamburgerMenuIcon.classList.remove("close"); // For the opening animation

    document.querySelector(".header__link").focus();

    document.addEventListener("keyup", closeMenuWithEscapeKey);
    headerMenuList.addEventListener("click", closeMenuBySelection);
  } else {
    hamburgerMenuIcon.classList.add("close"); // For the closing animation

    document.removeEventListener("keyup", closeMenuWithEscapeKey);
    headerMenuList.removeEventListener("click", closeMenuBySelection);
  }
};

hamburgerMenuIcon.addEventListener("click", toggleMenu);

// Search form
const btnSearch = document.querySelector(".btn-search--mobile");
const formSearch = document.querySelector(".search-form");
const inputSearch = document.querySelector(".search-form__input");

const toggleForm = () => {
  const isOpen = formSearch.classList.toggle("open");
  btnSearch.classList.toggle("active");

  if (isOpen) inputSearch.focus();
};

btnSearch.addEventListener("click", toggleForm);
