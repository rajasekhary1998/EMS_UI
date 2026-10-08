import axios from "axios";

const API =
  "https://localhost:7189/api/designations";

// GET ALL
export const getDesignations = async () => {
  const response = await axios.get(API);
  return response.data;
};

// CREATE
export const createDesignation = async (data: {
  designationName: string;
  departmentId: number;
}) => {
  const response = await axios.post(API, data);
  return response.data;
};

// UPDATE
export const updateDesignation = async (
  id: number,
  data: {
    designationName: string;
    departmentId: number;
  }
) => {
  const response = await axios.put(
    `${API}/${id}`,
    data
  );

  return response.data;
};

// DELETE
export const deleteDesignation = async (
  id: number
) => {
  const response = await axios.delete(
    `${API}/${id}`
  );

  return response.data;
};