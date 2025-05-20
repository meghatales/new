// src/app/auth/signup/page.tsx
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="container mx-auto px-4 py-12 flex justify-center items-start min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Create Account</h1>
        <SignUpForm />
      </div>
    </main>
  );
}

