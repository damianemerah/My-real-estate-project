const formInputTag = document.querySelector(".tags__field-input");
const formList = document.querySelector(".tags__field");

export function handleFormTag(event) {
  if (
    event.key === "," ||
    event.code === "Comma" ||
    event.code === "Unidentified"
  ) {
    formInputTag.value
      .split(",")
      .map((tag) => tag.trim())
      .forEach((el) => {
        if (el !== "") {
          // Skip empty tags
          const markup = `
              <li class="tags__field-tag">
                  <span class="chec-tag">
                    ${el}
                  </span>
                  <button type="button" title="Dismiss" class="chec-tag__dismiss">
                          X
                  </button>
              </li>
              `;
          formList.insertAdjacentHTML("beforeend", markup);
        }
      });
    formInputTag.value = "";
  }
  if (event.key === "Delete" || event.key === "Backspace") {
    const list = document.querySelector("#tags__field");
    const lastEl = list.children[list.children.length - 1];
    if (lastEl) lastEl.remove();
  }
}
