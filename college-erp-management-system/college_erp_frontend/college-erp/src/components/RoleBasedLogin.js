import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

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
      // const response = await axios.post("http://localhost:8080/auth/login", {
      //   username,
      //   password,
      // });

      // const { role } = response.data;
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
  );
}
