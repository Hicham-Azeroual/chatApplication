import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, UserCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const { token } = useParams(); // Get the token from the URL
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  const { resetPassword, isResetPasswordLoading } = useAuthStore(); // Use the resetPassword function and loading state

  const validateForm = () => {
    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) {
      await resetPassword(token, formData.password); // Call the resetPassword function
    }
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
              <h1 className="text-xl lg:text-2xl font-bold mt-2">Reset Password</h1>
              <p className="text-base-content/70 text-sm lg:text-base">
                Enter a new password to reset your account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/70">New Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-4 lg:size-5 text-base-content/50" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Enter new password"
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

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/70">Confirm Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-4 lg:size-5 text-base-content/50" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              disabled={isResetPasswordLoading} // Disable button when loading
            >
              {isResetPasswordLoading ? (
                <>
                  <Loader2 className="size-4 lg:size-5 animate-spin mr-2" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center">
            <p className="text-base-content/70 text-sm lg:text-base">
              Remember your password?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
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

export default ResetPasswordPage;