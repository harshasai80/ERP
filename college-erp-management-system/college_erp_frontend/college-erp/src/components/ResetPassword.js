import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { PiEyeClosedBold, PiEyeBold } from "react-icons/pi";
import Api from "../Api";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const resetToken = searchParams.get("token");
    if (!resetToken) {
      setError("Invalid or missing reset token.");
    } else {
      setToken(resetToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    console.log(token);

    try {
      const response = await Api.post(
        `/auth/reset-password?token=${token}&newPassword=${newPassword}`,
        null,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const data = await response.data;
      console.log(JSON.stringify(response.data));

      if (data.status !== 200) {
        setError(data.message || "Failed to reset password");
      } else {
        console.log("Password reset successfully!\n",JSON.stringify(data));
        alert("Password reset successfully!");
        navigate("/role-based-login");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 shadow-lg rounded-lg bg-white">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full mt-1 border p-2 rounded"
            />
            <button
              type="button"
              className="absolute right-5 top-7 translate-y-1 text-2xl text-gray-800"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <PiEyeClosedBold /> : <PiEyeBold />}
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full mt-1 border p-2 rounded"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
