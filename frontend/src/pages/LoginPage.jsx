import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoginIn } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) login(formData);
  };

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-base-100 text-base-content font-poppins pt-16">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Logo with Person Icons and Bracket Animation */}
          <div className="text-center mb-6 relative">
            {/* Left Person Icon */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 animate-bracket-left">
              <UserCircle className="size-8 lg:size-10 text-primary" />
            </div>

            {/* Right Person Icon */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 animate-bracket-right">
              <UserCircle className="size-8 lg:size-10 text-primary" />
            </div>

            {/* Title */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-10 lg:size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-5 lg:size-6 text-primary" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/70 text-sm lg:text-base">Sign in to continue your journey</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/70">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-4 lg:size-5 text-base-content/50" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/70">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-4 lg:size-5 text-base-content/50" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4 lg:size-5 text-base-content/50" />
                  ) : (
                    <Eye className="size-4 lg:size-5 text-base-content/50" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full bg-primary hover:bg-primary-focus text-white transition-all"
              disabled={isLoginIn}
            >
              {isLoginIn ? (
                <>
                  <Loader2 className="size-4 lg:size-5 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center">
            <Link to="/forgot-password" className="text-primary hover:underline text-sm lg:text-base">
              Forgot Password?
            </Link>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-base-content/70 text-sm lg:text-base">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - AuthImagePattern */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />

      {/* CSS Animations */}
      <style>
        {`
          @keyframes bracket-left {
            0%, 100% {
              transform: translate(-50%, -50%);
            }
            50% {
              transform: translate(-70%, -50%);
            }
          }
          @keyframes bracket-right {
            0%, 100% {
              transform: translate(50%, -50%);
            }
            50% {
              transform: translate(70%, -50%);
            }
          }
          .animate-bracket-left {
            animation: bracket-left 3s ease-in-out infinite;
          }
          .animate-bracket-right {
            animation: bracket-right 3s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;