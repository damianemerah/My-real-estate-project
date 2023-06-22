import axios from "axios";
import { showAlert } from "./alert";

export const formFields = (imageCover, imageList) => {
  const form = new FormData();

  const location = {
    state: document.querySelector(".location-state").value,
    city: document.querySelector(".location-city").value,
  };
  const tags = [...document.querySelectorAll(".chec-tag")].map((el) =>
    el.textContent.trim()
  );

  form.append("name", document.querySelector(".name").value);
  form.append("price", +document.querySelector(".price").value.trim());
  form.append(
    "priceDiscount",
    +document.querySelector(".priceDiscount").value.trim()
  );

  form.append(
    "description",
    document.querySelector(".description").value.trim()
  );
  form.append("area", document.querySelector(".area").value.trim());
  form.append("type", document.querySelector(".type").value.trim());

  tags.forEach((tag) => form.append("tags", tag));
  form.append("location", JSON.stringify(location));

  form.append("imageCover", imageCover);

  for (let i = 0; i < imageList.length; i++) {
    form.append("images", imageList[i]);
  }

  return form;
};

export const addProperty = async (data, type) => {
  try {
    if (document.querySelector(".type").value.trim().toLowerCase() !== "land") {
      const amenities = [
        {
          amenity: `${
            type === "new"
              ? "bed"
              : document.querySelector(".amenity-bed").dataset.amenity
          }`,
          quantity: +document.querySelector(".quantity-bed").value.trim(),
        },
        {
          amenity: `${
            type === "new"
              ? "bath"
              : document.querySelector(".amenity-bath").dataset.amenity
          }`,
          quantity: +document.querySelector(".quantity-bath").value.trim(),
        },
        {
          amenity: `${
            type === "new"
              ? "toilet"
              : document.querySelector(".amenity-toilet").dataset.amenity
          }`,
          quantity: +document.querySelector(".quantity-toilet").value.trim(),
        },
      ];
      data.append("amenities", JSON.stringify(amenities));
    } else {
      data.append("amenities", JSON.stringify([]));
    }

    const id = window.location.pathname
      .split("/")
      .find((el) => el.length > 11 && (el !== "property" || el !== "update"));

    const url =
      type === "new"
        ? "http://127.0.0.1:3000/api/v1/property/new"
        : `http://127.0.0.1:3000/api/v1/property/${id}`;

    const res = await axios({
      method: type === "new" ? "POST" : "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", "Updated Successfully");
      setTimeout(() => {
        window.location.assign(`/property/${res.data.data.data._id}`);
      }, 3000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const deleteProperty = async () => {
  try {
    const id = window.location.pathname
      .split("/")
      .find((el) => el.length > 11 && (el !== "property" || el !== "update"));
    const url = `http://127.0.0.1:3000/api/v1/property/${id}`;
    const res = await axios({
      url,
      method: "DELETE",
    });

    if (res.data.status === "success") {
      window.location.reload();
      setTimeout(() => {
        window.location.assign("/");
      }, 3000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://127.0.0.1:3000/api/v1/users/updateMyPassword/"
        : "http://127.0.0.1:3000/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} Updated sucessfully`);
      setTimeout(() => {
        window.location.assign("/me");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const addBookmark = async (data, type, el = null) => {
  try {
    const url =
      type === "add"
        ? "http://127.0.0.1:3000/api/v1/users/bookMark/add"
        : "http://127.0.0.1:3000/api/v1/users/bookmark/remove";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      if (type === "add") el.classList.add("active");
      showAlert("success", `Bookmark ${type === "add" ? "added" : "removed"}`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
