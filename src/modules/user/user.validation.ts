import z from "zod";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 character!" })
    .max(50, { message: "Name cannot excees 50 characters" }),
  email: z
    .string()
    .min(2, { message: "Email must be at least 2 character!" })
    .max(50, { message: "Email cannot excees 50 characters" }),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message: "Phone number must be valid for Bangladesh",
    })
    .optional(),
  password: z
    .string()
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number." })
    .min(8, { message: "Password must be at least 8 characters long." }),
  address: z
    .string()
    .max(200, { message: "Address cannot excees 200 characters." }),
});
