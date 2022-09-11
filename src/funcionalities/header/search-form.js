import { $ } from "../../utils/getElement.js";

const btnSearch = $(".btn-search--mobile");
const formSearch = $(".search-form");

export const toggleForm = () => {
  const isOpen = btnSearch.getAttribute("aria-expanded") === "false";
  btnSearch.setAttribute("aria-expanded", isOpen);

  formSearch.classList.toggle("open");
  btnSearch.classList.toggle("active");

  if (isOpen) {
    btnSearch.setAttribute("aria-label", "Hidde form search");
    $(".search-form__input").focus();
  } else {
    btnSearch.setAttribute("aria-label", "Show form search");
  }
};
