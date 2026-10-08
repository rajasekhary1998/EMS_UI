import axios from "axios";

const API =
  "https://localhost:7189/api/employees";

export const getEmployees = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createEmployee = async (data: any) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const updateEmployee = async (id: number, data: any) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};

export const deleteEmployee = async (id: number) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};