import { validationForm } from "../../helpers/form-validation.js";
import { $ } from "../../helpers/getElement.js";

validationForm({
  formElement: $(".login__form"),
  successMessage: "Login success!",
  failMesssage: "Error: Something went wrong while logging in",
});
validationForm({
  formElement: $(".contact__form"),
  successMessage: "Message sent successfully!",
  failMesssage: "Message not sent! Check the form and correct it.",
});
