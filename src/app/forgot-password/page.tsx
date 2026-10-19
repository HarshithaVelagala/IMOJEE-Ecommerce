"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

export default function ForgotPasswordPage() {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitted(true);
    showToast("Reset link sent successfully!");
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-neutral-100">
        <div className="flex flex-col items-center">
          <Link href="/">
            <div className="relative w-48 h-14 mb-6">
              <Image
                src="/logo.png"
                alt="IMOJEE Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-neutral-600 text-center">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {isSubmitted ? (
          <div className="mt-8 space-y-6">
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 text-sm text-center font-medium">
              We&apos;ve sent a password reset link to <span className="font-bold">{email}</span>. Please check your inbox.
            </div>
            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-800 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(undefined);
                  }}
                  className={`block w-full pl-11 pr-4 py-3 border rounded-xl text-neutral-900 bg-neutral-50/50 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all ${
                    error ? "border-red-500 focus:ring-red-500" : "border-neutral-200"
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {error && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all cursor-pointer"
              >
                Send Reset Link
              </button>
            </div>

            <div className="text-center pt-2 border-t border-neutral-100">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-800 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
