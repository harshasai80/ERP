import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PiEyeClosedBold, PiEyeBold } from "react-icons/pi";
import Api from "../Api";

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state.data;
  const email = data.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    } else if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    } else if (oldPassword === newPassword) {
      setError("New password cannot be the same as the old password");
      return;
    }

    try {
      const response = await Api.post(
        `/auth/reset-password?email=${email}&newPassword=${newPassword}&oldPassword=${oldPassword}`,
        null,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const data = await response.data;

      if (data.status !== 200) {
        setError(data.message || "Failed to reset password");
      } else {
        navigate("/reset-success");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-sans">
      <div className="w-full max-w-md bg-[#2d2f36] p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Your Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-emerald-200 mb-1">
              Old Password
            </label>
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full bg-[#1f1f25] text-white border border-gray-700 p-2 rounded focus:outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-xl text-emerald-300"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <PiEyeClosedBold /> : <PiEyeBold />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-emerald-200 mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-[#1f1f25] text-white border border-gray-700 p-2 rounded focus:outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-xl text-emerald-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <PiEyeClosedBold /> : <PiEyeBold />}
            </button>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-emerald-200 mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-[#1f1f25] text-white border border-gray-700 p-2 rounded focus:outline-none"
            />
          </div>

          {/* Error message */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 transition p-2 rounded-md font-semibold text-white"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
