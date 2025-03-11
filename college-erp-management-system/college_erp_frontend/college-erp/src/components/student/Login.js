import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import Api from "../../Api";

const Login = () => {
  const [formData, setFormData] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigation

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
        // ✅ If HTTP status is 200, redirect to Dashboard
        navigate("/dashboard", { state: { student: data } });
      } else {
        alert("Invalid registration number. Try again!");
      }
    } catch (error) {
      if (error.response) {
        // ✅ Check HTTP status from error response
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
    <div className="flex justify-center items-center h-screen bg-gray-300">
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
  );
};

export default Login;
