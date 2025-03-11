import React from "react";
import { useNavigate,Link } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-200 to-gray-300">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#2D2A43] to-[#3D3A63] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4 transform hover:rotate-3 transition-transform duration-300">
              <img
                src="/logo128.png"
                alt="SGP Logo"
                className="h-12 w-12 rounded-full border-2 border-purple-300 shadow-md"
              />
            </div>
            <div className="group">
              <h1 className="text-2xl font-bold tracking-wider ">
                <span className="text-purple-300 group-hover:hidden ">SGP</span>
                <span className="text-purple-300 hidden group-hover:inline">
                  Sanjay Gandhi Polytechnic
                </span>{" "}
                ERP System
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/role-based-login"
              className="hover:text-purple-300 transition duration-300 font-medium px-4 py-2 rounded-lg hover:bg-[#3D3A63]"
            >
              Login
            </Link>
            <Link to="/login/student"
              className="hover:text-purple-300 transition duration-300 font-medium px-4 py-2 rounded-lg hover:bg-[#3D3A63]"
            >
              Student Search
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-xl p-10 text-center border-t-4 border-[#9569D8]">
          <h2 className="text-3xl font-bold mb-8 text-[#2D2A43] relative inline-block">
            Welcome to Sanjay Gandhi Polytechnic ERP System
          </h2>

          <p className="text-gray-600 mb-10 max-w-3xl mx-auto text-lg">
            Manage student information, attendance, results, and more with our
            comprehensive ERP solution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            <div className="bg-gradient-to-br from-[#2D2A43] to-[#352F54] p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="bg-[#9569D8] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Student Management
              </h3>
              <p className="text-gray-300 mb-6">
                Access and manage student records efficiently.
              </p>
              <button 
              onClick={() => navigate("/role-based-login")}
              className="bg-[#9569D8] hover:bg-purple-700 text-white py-2 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg font-medium">
                Access
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#2D2A43] to-[#352F54] p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="bg-[#9569D8] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Attendance Tracking
              </h3>
              <p className="text-gray-300 mb-6">
                Monitor and record student attendance easily.
              </p>
              <button 
              onClick={() => navigate("/login/student")}
              className="bg-[#9569D8] hover:bg-purple-700 text-white py-2 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg font-medium">
                Track
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#2D2A43] to-[#352F54] p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="bg-[#9569D8] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Results Portal
              </h3>
              <p className="text-gray-300 mb-6">
                Manage and publish examination results.
              </p>
              <button 
              onClick={() => navigate("/login/student")}
              className="bg-[#9569D8] hover:bg-purple-700 text-white py-2 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg font-medium">
                Results
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button
              className="bg-gradient-to-r from-[#9569D8] to-[#8559C8] hover:from-[#8559C8] hover:to-[#7549B8] text-white py-3 px-8 rounded-lg font-semibold transition duration-300 shadow-lg flex items-center"
              onClick={() => navigate("/login/student")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              Student Login
            </button>
            <button 
            onClick={() => navigate("/role-based-login")}
            className="bg-gradient-to-r from-[#9569D8] to-[#8559C8] hover:from-[#8559C8] hover:to-[#7549B8] text-white py-3 px-8 rounded-lg font-semibold transition duration-300 shadow-lg flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"               
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Faculty Login
            </button>
            <button 
            onClick={() => navigate("/role-based-login")}
            className="bg-gradient-to-r from-[#9569D8] to-[#8559C8] hover:from-[#8559C8] hover:to-[#7549B8] text-white py-3 px-8 rounded-lg font-semibold transition duration-300 shadow-lg flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Administration
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#2D2A43] to-[#3D3A63] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-semibold">
                Sanjay Gandhi Polytechnic Ballari
              </h3>
              <p className="text-purple-300 mt-2">
                Excellence in Technical Education
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-purple-300 hover:text-white transition duration-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Contact
              </a>
              <a
                href="#"
                className="text-purple-300 hover:text-white transition duration-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                About
              </a>
              <a
                href="#"
                className="text-purple-300 hover:text-white transition duration-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                Privacy Policy
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-purple-300 text-sm">
            © 2025 Sanjay Gandhi Polytechnic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
