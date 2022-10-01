import { toast } from "https://cdn.skypack.dev/wc-toast";

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
  email: {
    required: true,
    regex:
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    errorMessages: {
      regex: "Email format invalid",
      required: "Email field cannot be empty",
    },
  },
  password: {
    required: true,
    minLength: 8,
    errorMessages: {
      required: "Password field cannot be empty",
      minLength: "Password must be at least 8 characters long",
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
    error = `${errorMessages.minLength}. You have ${value.length} character(s)`;
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

const validateForm = (inputs) => {
  let isValid = true;

  [...inputs].forEach((input) => {
    const { error } = checkInput({ field: input });

    if (error) isValid = false;
  });

  return isValid;
};

export const validationForm = ({
  formElement,
  successMessage,
  failMesssage = "Error: Form invalid!",
}) => {
  formElement.addEventListener("focusout", (e) => {
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") return;

    const { error } = checkInput({ field: e.target });
    const errorElement = document.getElementById(`${e.target.name}-error`);

    if (error) {
      renderInlineError({ errorElement, error });
      return;
    }

    clearInlineError({ errorElement });
  });

  formElement.addEventListener("submit", (e) => {
    e.preventDefault();

    const formInputs = formElement.querySelectorAll(".form__input");
    const isValid = validateForm(formInputs);

    if (!isValid) {
      const firstErrorElement = formElement.querySelector(
        "[aria-invalid=true]"
      );
      firstErrorElement?.focus();
      toast(failMesssage, {
        icon: {
          type: "error",
        },
        duration: 3000,
      });
      return;
    }

    const formItems = formElement.querySelectorAll(".form__item");
    formItems.forEach((node) => {
      clearValidationStates({ node });
    });

    formElement.reset();

    toast(successMessage, {
      icon: {
        type: "success",
      },
      duration: 3000,
    });
  });
};
