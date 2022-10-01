import { toast } from "https://cdn.skypack.dev/wc-toast";
import { postProduct } from "../../../services/postProduct.js";
import { $ } from "../../../helpers/getElement.js";

const form = $(".form");
const imageInput = form.elements["image"];
const imagePreview = $(".product__image");

const mapElementSelector = {
  name: "product__title",
  description: "product__text",
  price: "product__price",
};

/**
 * It takes an element and text as arguments and sets the element's text content to the text
 */
const previewText = ({ element, text }) => {
  element.textContent = text;
};

/**
 * It takes the form controls and returns an object with the form data and an unique ID
 * @returns An object with an unique ID and the name and value of each input.
 */
const getFormData = () => {
  const elements = document.querySelectorAll(".form__input");

  const formData = {
    id: window.crypto.randomUUID(),
  };

  elements.forEach(({ name, value }) => {
    formData[name] = value;
  });

  return formData;
};

/**
 * If the element is an input or textarea, and the value is not empty, then preview the content.
 * @param e - the event object
 * @returns The function handleBlur is being returned.
 */
const handleBlur = (e) => {
  const { name, value, tagName } = e.target;

  if (tagName !== "INPUT" && tagName !== "TEXTAREA") return;

  if (name === "imageUrl") {
    handleImageChange(e);
    return;
  }

  if (name === "category") return;

  if (!value) return;

  const element = $(`.${mapElementSelector[name]}`);
  const text = name === "price" ? `$${value}` : value;

  previewText({ element, text });
};

/**
 * It previews the image URL entered by the user
 * @param e - The event object
 */
const handleImageChange = (e) => {
  imagePreview.setAttribute("src", e.target.value);
};

/**
 * It posts the product object to the server
 * @param e - The event object
 */
const handleSubmit = async (e) => {
  e.preventDefault();

  const btnSubmit = $(".form__button");
  btnSubmit.disabled = true;

  const formData = getFormData();

  try {
    await postProduct(formData);

    btnSubmit.disabled = false;

    toast("Product create successfully!", {
      icon: {
        type: "success",
      },
    });
    form.reset();
  } catch (_) {
    btnSubmit.disabled = false;
    toast("Error: Something went wrong!", {
      icon: {
        type: "error",
      },
    });
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("focusout", handleBlur);
imageInput.addEventListener("change", handleImageChange);
