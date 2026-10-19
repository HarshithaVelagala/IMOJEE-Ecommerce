"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    mobile?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\+?[0-9]{7,15}$/.test(mobile.replace(/[- ]/g, ""))) {
      newErrors.mobile = "Please enter a valid mobile number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Mock register success
    showToast("Account created successfully!");
    router.push("/login");
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
            Create an account
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Sign up to get started with Imojee
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-neutral-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  className={`block w-full pl-11 pr-4 py-3 border rounded-xl text-neutral-900 bg-neutral-50/50 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all ${
                    errors.fullName ? "border-red-500 focus:ring-red-500" : "border-neutral-200"
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.fullName}</p>
              )}
            </div>

            {/* Email Field */}
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
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`block w-full pl-11 pr-4 py-3 border rounded-xl text-neutral-900 bg-neutral-50/50 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-neutral-200"
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-semibold text-neutral-700 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
                  }}
                  className={`block w-full pl-11 pr-4 py-3 border rounded-xl text-neutral-900 bg-neutral-50/50 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all ${
                    errors.mobile ? "border-red-500 focus:ring-red-500" : "border-neutral-200"
                  }`}
                  placeholder="+1 234 567 890"
                />
              </div>
              {errors.mobile && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.mobile}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`block w-full pl-11 pr-11 py-3 border rounded-xl text-neutral-900 bg-neutral-50/50 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-neutral-200"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  className={`block w-full pl-11 pr-11 py-3 border rounded-xl text-neutral-900 bg-neutral-50/50 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all ${
                    errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-neutral-200"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="mt-6 text-center border-t border-neutral-100 pt-6">
          <span className="text-sm text-neutral-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-purple-700 hover:text-purple-800 transition-colors">
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
