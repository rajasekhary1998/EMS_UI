import axios from "axios";
import type { DashboardData } from "../types/dashboard";
import type { Employee } from "../types/employee";

const API_URL = "https://localhost:7189/api";

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await axios.get(
    `${API_URL}/dashboard`
  );

  return response.data;
};

export const getRecentEmployeeData = async (): Promise<Employee[]> => {
  const response = await axios.get(
    `${API_URL}/employees`
  );

  return response.data;
};

export const createEmployee = async (
  employee: Employee
) => {
  const response = await axios.post(
    `${API_URL}/employees`,
    employee
  );

  return response.data;
};

export const deleteEmployee = async (
  employeeId: number
) => {
  const response = await axios.delete(
    `${API_URL}/employees/${employeeId}`
  );

  return response.data;
};
export const updateEmployee = async (
  id: number,
  employee: any
) => {
  const response =
    await axios.put(
       `${API_URL}/employees/${id}`,
      employee
    );

  return response.data;
};