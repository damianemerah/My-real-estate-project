export function handleImagePreview(previewContainer, files, numImg) {
  if (previewContainer.classList.contains("property__images-box--imageCover")) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = `<div class="property__images property__images-imageCover"><img class="cur__prop-img cur__prop-imageCover" src="${e.target.result}"><button class="property__img-delete" style="display: none;">Delete</button></div>`;

      previewContainer.innerHTML = "";
      previewContainer.insertAdjacentHTML("beforeend", img);
    };

    reader.readAsDataURL(files);
  }

  if (previewContainer.classList.contains("property__images-box-images")) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = `<div class="property__images property__images-event property__images-list"><img class="cur__prop cur__prop-img property__images-item" data-imagenum="${
          numImg + i
        }" src="${
          e.target.result
        }"><button class="property__img-delete">Delete</button></div>`;

        previewContainer.insertAdjacentHTML("beforeend", img);
      };

      reader.readAsDataURL(file);
    }
  }
}
