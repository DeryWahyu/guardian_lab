import { Suspense } from "react";
import { AuthCardSkeleton } from "../_components/auth-card-skeleton";
import { LoginForm } from "./_components/login-form";

export const metadata = {
  title: "Masuk — Guardian Lab",
  description: "Masuk ke akun Guardian Lab untuk akses forensic history dan sandbox terisolasi.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton title="Menyiapkan Sesi Masuk..." />}>
      <LoginForm />
    </Suspense>
  );
}
