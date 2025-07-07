import api from "./api";

export const loginUser = async (email, password) => {
  const res = await api.post("/users/login", { email, password });
  return res.data.token;
};

export const registerUser = async (name, email, password) => {
  const res = await api.post("/users/register", { name, email, password });
  return res.data.message;
};
