import api from "./api";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email: email.trim(),
    password: password,
  });

  return response.data;
};


export const registerUser = async (
  fullName,
  email,
  password,
  phoneNumber,
  role
) => {
  const response = await api.post("/auth/register", {
    fullName: fullName.trim(),
    email: email.trim(),
    password: password,
    phoneNumber: phoneNumber.trim(),
    role: role,
  });

  return response.data;
};

export const saveAuthData = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);
  localStorage.setItem("role", data.role);
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
};