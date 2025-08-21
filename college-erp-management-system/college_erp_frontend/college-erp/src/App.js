import { React } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./components/student/Login";
import DashBoard from "./components/dashboard/DashBoard";
import Home from "./components/Home";
import "./App.css";
import RoleBasedLogin from "./components/RoleBasedLogin";
import HodDashboard from "./components/dashboard/HodDashboard";
import FacultyDashboard from "./components/dashboard/FacultyDashboard";
import PrincipalDashboard from "./components/dashboard/PrincipalDashboard";
import ResetPassword from "./components/ResetPassword";
import ResetSuccess from "./components/ResetSuccess";
import About from "./components/common/About";
import Contact from "./components/common/Contact";

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
        <Route path="/principal-dashboard" element={<PrincipalDashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-details" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
};
// done something
export default App;
