import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Api";

const Login = () => {
  const [formData, setFormData] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post(
        `/student/login?registrationNumber=${formData}`,
        null,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      const data = await response.data;
      console.log(JSON.stringify(response.data));
      if (response.status === 200) {
        navigate("/dashboard", { state: { student: data } });
      } else {
        alert("Invalid registration number. Try again!");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Unauthorized: Invalid credentials.");
        } else if (error.response.status === 404) {
          alert("Student not found. Check your registration number.");
        } else {
          alert(`Error ${error.response.status}: ${error.response.statusText}`);
        }
      } else {
        alert("Network error or server not responding.");
      }
      console.error("Login failed:", error.response?.data || error.message);
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
        <div className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">Student Login</div>
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
        <form
          className="bg-[#2e2e48] p-6 rounded-lg shadow-lg text-center w-80"
          onSubmit={handleSubmit}
        >
          <h2 className="text-white text-xl font-bold mb-2">Register</h2>
          <div className="mb-4 text-left">
            <label className="text-white block pl-1 mb-1">Reg. No</label>
            <input
              type="text"
              onChange={handleChange}
              placeholder="Enter Reg. No"
              className="w-full px-3 py-2 rounded-md border border-gray-600 bg-[#b5b5d3] text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <button className="w-full py-2 rounded-md bg-[#7a57b7] text-white font-semibold hover:bg-[#5629c0] transition duration-200">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
