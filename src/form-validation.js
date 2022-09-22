import { toast } from "https://cdn.skypack.dev/wc-toast";
import { $ } from "./utils/getElement.js";

const form = $(".contact__form");
const formInputs = document.querySelectorAll(".form__input");

const states = {
  VALID: "valid",
  INVALID: "invalid",
};

const constraints = {
  name: {
    required: true,
    errorMessages: {
      required: "Name field cannot be empty",
    },
  },
  message: {
    required: true,
    minLength: 10,
    errorMessages: {
      required: "Message field cannot be empty",
      minLength: "Message must be at least 10 characters long",
    },
  },
};

const setClassName = ({ node, className }) => {
  node.classList.add(className);
};

const removeClassName = ({ node, className }) => {
  node.classList.remove(className);
};

const renderInlineError = ({ errorElement, error }) => {
  errorElement.innerHTML = `
    <span class="visually-hidden">Error: </span>
    ${error}
  `;
};

const clearInlineError = ({ errorElement }) => {
  errorElement.innerText = "";
};

const clearValidationStates = ({ node }) => {
  Object.values(states).forEach((state) => {
    removeClassName({ node, className: state });
  });
};

const renderValidationState = ({ node, state }) => {
  clearValidationStates({ node });

  if (state === states.INVALID) {
    setClassName({ node, className: states.INVALID });
  } else {
    setClassName({ node, className: states.VALID });
  }
};

const validateField = ({ name, value }) => {
  const { required, regex, minLength, errorMessages } = constraints[name];
  let isValid = true;
  let error = "";

  if (required && !value) {
    error = errorMessages.required;
  } else if (regex && !regex.test(value)) {
    error = errorMessages.regex;
  } else if (minLength && value.length < minLength) {
    error = errorMessages.minLength;
  }

  if (error) {
    isValid = false;
  }

  return { isValid, error };
};

const checkInput = ({ field }) => {
  const { name, value } = field;
  const formItem = field.closest(".form__item");

  const { isValid, error } = validateField({ name, value });

  if (isValid) {
    field.setAttribute("aria-invalid", false);
    renderValidationState({ node: formItem, state: states.VALID });
  } else {
    field.setAttribute("aria-invalid", true);
    renderValidationState({ node: formItem, state: states.INVALID });
  }

  return { error };
};

const validateForm = () => {
  let isValid = true;

  [...formInputs].forEach((input) => {
    const { error } = checkInput({ field: input });

    if (error) isValid = false;
  });

  return isValid;
};

form.addEventListener("focusout", (e) => {
  if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") return;

  const { error } = checkInput({ field: e.target });
  const errorElement = document.getElementById(`${e.target.name}-error`);

  if (error) {
    renderInlineError({ errorElement, error });
    return;
  }

  clearInlineError({ errorElement });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const isValid = validateForm();

  if (!isValid) {
    const firstErrorElement = document.querySelector("[aria-invalid=true]");
    firstErrorElement.focus();
    toast("Error: Form invalid!", {
      icon: {
        type: "error",
      },
      duration: 3000,
    });
    return;
  }

  const formItems = document.querySelectorAll(".form__item");
  formItems.forEach((node) => {
    clearValidationStates({ node });
  });

  form.reset();

  console.log("Form sent successfully!");

  toast("Message sent successfully!", {
    icon: {
      type: "success",
    },
    duration: 3000,
  });
});
