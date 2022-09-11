import { $ } from "../../utils/getElement.js";

const btnHamburger = $(".header__hamburger");
const list = $(".header__nav-list");
const nav = $(".header__nav");

/**
 * When the user clicks on a menu item, close the menu.
 */
const closeMenuBySelection = ({ target }) => {
  if (target.tagName !== "A") return;

  toggleMenu();
};

/**
 * Close menu on keydown Escape if the menu is open and set focus to the menu button
 * @param { key } - The key pressed, destructurated from the event object.
 */
const closeMenuWithEscapeKey = ({ key }) => {
  if (!btnHamburger.classList.contains("open")) return;
  if (key !== "Escape") return;

  toggleMenu();
  btnHamburger.focus();
};

/**
 * It adds the event listeners to the nav and the list element when the menu is opened.
 */
const addEventsToCloseMenu = () => {
  nav.addEventListener("keyup", closeMenuWithEscapeKey);
  list.addEventListener("click", closeMenuBySelection);
};

/**
 * It removes the event listeners that were added to the nav and the list
 * element when the menu was opened.
 */
const cleanEventsToCloseMenu = () => {
  nav.removeEventListener("keyup", closeMenuWithEscapeKey);
  list.removeEventListener("click", closeMenuBySelection);
};

/**
 *  Handler for the menu button's click event:  Open and close the menu
 */
export const toggleMenu = () => {
  console.log(btnHamburger.getAttribute("aria-expanded"));
  const isOpen = btnHamburger.getAttribute("aria-expanded") === "false";
  btnHamburger.setAttribute("aria-expanded", isOpen);

  btnHamburger.classList.toggle("open");
  list.classList.toggle("open");

  if (isOpen) {
    btnHamburger.setAttribute("aria-label", "Close navigation menu");
    btnHamburger.classList.remove("close");
    $(".header__link").focus();
    addEventsToCloseMenu();
  } else {
    btnHamburger.setAttribute("aria-label", "Open navigation menu");
    btnHamburger.classList.add("close"); // For the closing animation
    cleanEventsToCloseMenu();
  }
};
