import { z } from "zod";

export const employeeSchema = z.object({
  employeeCode: z
    .string()
    .min(1, "Employee Code is required")
    .max(
      20,
      "Employee Code cannot exceed 20 characters"
    ),

  firstName: z
    .string()
    .min(1, "First Name is required")
    .max(
      100,
      "First Name cannot exceed 100 characters"
    )
    .regex(
      /^[A-Za-z ]+$/,
      "Only letters are allowed"
    ),

  lastName: z
    .string()
    .min(1, "Last Name is required")
    .max(
      100,
      "Last Name cannot exceed 100 characters"
    )
    .regex(
      /^[A-Za-z ]+$/,
      "Only letters are allowed"
    ),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid Email"),

  phone: z
    .string()
    .regex(
      /^[0-9]{10}$/,
      "Phone Number must be 10 digits"
    ),

  departmentId: z
    .number()
    .min(1, "Department Id is required"),

  status: z.enum([
    "ACTIVE",
    "INACTIVE",
  ]),

  joiningDate: z
    .string()
    .min(
      1,
      "Joining Date is required"
    ),
});