// services/departmentService.ts

import axios from "axios";

const API =
  "https://localhost:7189/api/departments";

export const getDepartments =
  async () => {
    const response =
      await axios.get(API);

    return response.data;
  };

export const createDepartment = async (departmentName: string) => {
  const response = await axios.post(API, {
    departmentName,
    createdAt: new Date().toISOString(),
  });

  return response.data;
};

export const updateDepartment = async (
  id: number,
  departmentName: string
) => {
  const response = await axios.put(`${API}/${id}`, {
    departmentName,
    updatedAt: new Date().toISOString(),
  });

  return response.data;
};

export const deleteDepartment = async (id: number) => {
  const response = await axios.delete(`${API}/${id}`);
  return response.data;
};