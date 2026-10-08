import { z } from "zod";

export const designationSchema =
  z.object({
    designationName: z
      .string()
      .min(2, "Designation Name is required"),

    departmentId: z
      .number()
      .min(1, "Department is required"),
  });