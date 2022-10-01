import { renderProducts } from "../../components/Product/index.js";
import { validationForm } from "../../helpers/form-validation.js";
import { $ } from "../../helpers/getElement.js";

const listProducts = $(".products__grid");
renderProducts({ element: listProducts });

validationForm({
  formElement: $(".contact__form"),
  successMessage: "Message sent successfully!",
  failMesssage: "Message not sent! Check the form and correct it.",
});
