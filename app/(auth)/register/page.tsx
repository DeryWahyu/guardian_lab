import { Suspense } from "react";
import { AuthCardSkeleton } from "../_components/auth-card-skeleton";
import { RegisterForm } from "./_components/register-form";

export const metadata = {
  title: "Daftar Akun — Guardian Lab",
  description:
    "Bergabung bersama ribuan analis muda di Guardian Lab melawan phishing & malware APK.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton title="Menyiapkan Pendaftaran..." />}>
      <RegisterForm />
    </Suspense>
  );
}
