import "core-js/stable";
import "regenerator-runtime/runtime";

import { login, logout } from "./login";
import { handleFormTag } from "./handleFormTag";
import { truncateText } from "./truncateText";
import { formFields, addProperty, deleteProperty } from "./handleFormSubmit";
import { handleImagePreview } from "./handleImagePreview";

const loginForm = document.querySelector(".form--login");
const formInputTag = document.querySelector(".tags__field-input");
const tagList = document.querySelector(".tags__field");
const propertyForm = document.querySelector(".form__property");
const propertyFormUpdate = document.querySelector(".form__property-update");
const logoutBtn = document.querySelector(".nav__btn--logout");
const imagesBoxList = document.querySelectorAll(".property__images-box");
const imageCoverInput = document.querySelector(".imageCover-input");
const imagesInput = document.querySelector(".images-input");
const imgList = document.querySelectorAll(".property__images-item");
const deletePropBtn = document.querySelector(".btn-delete__property");

let selectedImagesList = [];
let selectedImageCover = "";
let numImg = 1;

truncateText(".blog__card-text", 60);

// Get images in DB
if (propertyFormUpdate) {
  selectedImagesList = selectedImagesList.splice(0);

  imgList.forEach((img) => {
    if (typeof img.src === "string") {
      const imgStr = img.src
        .split("/")
        .find(
          (el) => el.startsWith(`${"property".toLowerCase()}`) && el.length > 15
        );

      selectedImagesList.push({
        img: imgStr,
        imgNum: numImg,
      });
      numImg++;
    }
  });

  selectedImageCover = document
    .querySelector(".cur__prop-imageCover")
    .src.split("/")
    .find(
      (el) => el.startsWith(`${"property".toLowerCase()}`) && el.length > 15
    );
}

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });

if (logoutBtn) logoutBtn.addEventListener("click", logout);

const fileInput = document.querySelector(".images");
const selectedFilesContainer = document.querySelector(".selectedFiles");

if (fileInput)
  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;

    selectedFilesContainer.innerHTML = "";
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name;

      const fileItem = document.createElement("span");
      fileItem.textContent = fileName;
      selectedFilesContainer.appendChild(fileItem);
    }
  });

if (formInputTag)
  formInputTag.addEventListener("keyup", (event) => {
    handleFormTag(event);
  });

if (tagList)
  tagList.addEventListener("click", (e) => {
    const target = e.target.closest(".chec-tag__dismiss");

    if (target) {
      const el = target.closest(".tags__field-tag");
      el.remove();
    }
  });

if (deletePropBtn)
  deletePropBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deleteProperty();
  });

if (propertyForm)
  propertyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const imgList = selectedImagesList.map((el) => el.img || el.imgObj);

    const form = formFields(selectedImageCover, imgList);

    addProperty(form, "new");
  });

if (propertyFormUpdate) {
  propertyFormUpdate.addEventListener("submit", (e) => {
    e.preventDefault();

    const imgList = selectedImagesList.map((el) => el.img || el.imgObj);

    const form = formFields(selectedImageCover, imgList);

    for (const [key, value] of form.entries()) {
      console.log(key, value);
    }

    addProperty(form, "update");
  });
}

if (propertyForm || propertyFormUpdate) {
  const propertyType = document.querySelector(".type");
  const amenitiesField = document.querySelector(".amenities");

  propertyType.addEventListener("change", () => {
    console.log(amenitiesField);
    if (propertyType.value.toLowerCase() === "land") {
      amenitiesField.style.display = "none";
    } else {
      amenitiesField.style.display = "block";
    }
  });

  imagesBoxList.forEach((imagesBox) => {
    imagesBox.addEventListener("mouseover", (e) => {
      const target = e.target.closest(".property__images");

      if (target) {
        const delBtn = target.querySelector(".property__img-delete");
        delBtn.style.display = "block";
      }
    });

    imagesBox.addEventListener("mouseout", (event) => {
      const target = event.target.closest(".property__images");

      if (target) {
        const delBtn = target.querySelector(".property__img-delete");
        delBtn.style.display = "none";
      }
    });

    imagesBox.addEventListener("click", (event) => {
      const target = event.target.closest(".property__img-delete");

      if (target) {
        const elem = target.closest(".property__images");
        const img = target.parentElement.querySelector("img");

        if (img.src.startsWith("http")) {
          // Handle existing image URL
          if (img.classList.contains("cur__prop-imageCover")) {
            console.log(selectedImageCover);
            selectedImageCover = "";
          } else {
            const itemIndex = selectedImagesList.findIndex(
              (el) =>
                el.img ===
                img.src
                  .split("/")
                  .find(
                    (el) =>
                      el.startsWith(`${"property".toLowerCase()}`) &&
                      el.length > 15
                  )
            );

            if (itemIndex !== -1) {
              selectedImagesList.splice(itemIndex, 1);
            }
          }
        } else {
          // Handle file preview images
          const imgNum = +img.dataset.imagenum;

          const itemIndex = selectedImagesList.findIndex(
            (el) => el.imgNum === imgNum
          );

          selectedImagesList.splice(itemIndex, 1);
        }

        elem.remove();
      }
    });
  });

  imageCoverInput.addEventListener("change", (e) => {
    const selectedFile = e.target.files[0];
    selectedImageCover = selectedFile;
    const previewContainer = document.querySelector(
      ".property__images-box--imageCover"
    );

    handleImagePreview(previewContainer, selectedImageCover);
    imageCoverInput.value = "";
  });

  //images
  imagesInput.addEventListener("change", (e) => {
    let currentNumImg = numImg;

    const list = selectedImagesList
      .filter((el) => "imgObj" in el)
      .map((el) => el.imgObj.name);

    const selectedFiles = [...e.target.files];
    const filteredFile = selectedFiles.filter((el) => !list.includes(el.name));

    console.log(filteredFile);

    filteredFile.forEach((el) => {
      selectedImagesList.push({
        imgObj: el,
        imgNum: numImg,
      });
      numImg++;
    });

    console.log(selectedImagesList);

    const previewContainer = document.querySelector(
      ".property__images-box-images"
    );

    handleImagePreview(previewContainer, filteredFile, currentNumImg);

    imagesInput.value = "";
  });
}
