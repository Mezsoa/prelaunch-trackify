
import * as z from "zod";

export const discountFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Discount name must be at least 2 characters" }),
  code: z
    .string()
    .min(3, { message: "Discount code must be at least 3 characters" })
    .regex(/^[A-Z0-9_-]+$/, {
      message:
        "Discount code can only contain uppercase letters, numbers, underscores, and hyphens",
    }),
  description: z.string().optional(),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be positive" }),
  type: z.enum(["percentage", "fixed"]),
  max_uses: z.coerce
    .number()
    .nullable()
    .optional(),
  expires_at: z
    .string()
    .optional()
    .transform((val) => val || undefined),
});

export type DiscountFormValues = z.infer<typeof discountFormSchema>;
