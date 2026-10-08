// validations/departmentSchema.ts

import { z } from "zod";

export const departmentSchema =
  z.object({
    departmentName: z
      .string()
      .min(
        2,
        "Department Name is required"
      )
      .max(
        50,
        "Maximum 50 characters"
      ),
  });