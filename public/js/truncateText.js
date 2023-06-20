export const truncateText = (selector, maxLength) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach((element) => {
    const text = element.textContent;
    const fileInput = document.querySelector(".images");
    const selectedFilesContainer = document.querySelector(".selectedFiles");
    if (fileInput)
      fileInput.addEventListener("change", (event) => {
        selectedFilesContainer.innerHTML = "";

        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = file.name;

          const fileItem = document.createElement("span");
          fileItem.textContent = fileName;
          selectedFilesContainer.appendChild(fileItem);
        }
      });
    if (text.length > maxLength) {
      const truncatedText = text.substring(0, maxLength) + "...";
      element.textContent = truncatedText;
    }
  });
};
