import { React } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./components/student/Login";
import DashBoard from "./components/dashboard/DashBoard";
import Home from "./components/Home";
import "./App.css";
import RoleBasedLogin from "./components/RoleBasedLogin";
import HodDashboard from "./components/dashboard/HodDashboard";
import FacultyDashboard from "./components/dashboard/FacultyDashboard";

// import Admin from "./components/Admin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/student" element={<Login />} />
        <Route path="/dashBoard" element={<DashBoard />} />
        <Route path="/role-based-login" element={<RoleBasedLogin />} />
        <Route path="/hod-dashboard" element={<HodDashboard />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />

        {/* <Route path="/admin" element={<Admin />} /> */}
        {/* Add more routes here when needed */}
      </Routes>
    </BrowserRouter>
  );
};
// done something
export default App;
