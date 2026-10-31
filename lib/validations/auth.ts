import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .toLowerCase(),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const baseRegisterSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Za-z]/, "Password harus mengandung minimal satu huruf")
    .regex(/[0-9]/, "Password harus mengandung minimal satu angka"),
  confirmPassword: z.string().optional(),
});

export const registerSchema = baseRegisterSchema.refine(
  (data) => !data.confirmPassword || data.password === data.confirmPassword,
  {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  },
);

export type RegisterInput = z.infer<typeof registerSchema>;

export const registerFormSchema = baseRegisterSchema
  .extend({
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterFormInput = z.infer<typeof registerFormSchema>;

/**
 * Sanitizes redirect search parameters to prevent open-redirect vulnerabilities.
 * Ensures the target starts with a single `/` and does not contain protocol or double slashes.
 */
export function getSafeRedirectUrl(target: string | null | undefined, fallback = "/"): string {
  if (!target || typeof target !== "string") return fallback;
  const trimmed = target.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/\\")) {
    return trimmed;
  }
  return fallback;
}
