import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function RoleBasedLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const data = {
    sgpcshod: "HOD",
    sgpcsfaculty: "FACULTY",
    sgpcsp: "PRINCIPAL",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const role = data[username];
      console.log("Role:", role);
      if (role === "HOD") navigate("/hod-dashboard");
      else if (role === "FACULTY") navigate("/faculty-dashboard");
      else if (role === "PRINCIPAL") navigate("/principal-dashboard");
      else navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-300">
      {/* Navbar */}
      <nav className="bg-[#2D2A43] text-white flex justify-between items-center px-4 md:px-6 py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <img src="/logo128.png" alt="College Logo" className="h-8 md:h-10 w-auto" />
          <div className="text-sm md:text-lg font-semibold">Sanjay Gandhi Polytechnic</div>
        </div>
        <div className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">Role-Based Login</div>
        <div className="flex items-center gap-4 md:gap-6">
          <button
            className="bg-[#9569D8] hover:bg-[#ac3131] px-3 md:px-4 py-1 md:py-2 rounded text-white font-medium text-xs md:text-sm"
            onClick={() => navigate("/")}
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex flex-grow justify-center items-center">
        <div className="bg-[#2D2A43] p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-gray-200 text-center mb-4">Login</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-200">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded-lg mt-1"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-200">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-lg mt-1"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
