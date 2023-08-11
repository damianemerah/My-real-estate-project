import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Logged In successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });

    if ((res.data.status = "success")) {
      window.setTimeout(() => {
        location.reload(true);
        location.assign("/");
      }, 1000);
    }

    //true` force a reload from server
  } catch (err) {
    showAlert("error", "Error logging out! Try again.");
  }
};

export const signup = async (name, email, password, passwordConfirm, role) => {
  try {
    const data = {
      name,
      email,
      password,
      passwordConfirm,
      role,
    };
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", "Account created successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
