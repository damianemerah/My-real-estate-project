import "core-js/stable";
import "regenerator-runtime/runtime";

import { login } from "./login";

const loginForm = document.querySelector(".form--login");
const truncateText = (selector, maxLength) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach((element) => {
    const text = element.textContent;

    if (text.length > maxLength) {
      const truncatedText = text.substring(0, maxLength) + "...";
      element.textContent = truncatedText;
    }
  });
};
truncateText(".blog__card-text", 60);

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
