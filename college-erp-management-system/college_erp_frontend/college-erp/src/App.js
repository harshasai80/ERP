import { React } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./components/student/Login";
import StudentDashBoard from "./components/dashboard/StudentDashBoard";
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
import Team from "./components/common/Team";
import Rohan from "./components/portfolios/Rohan";
import Zuber from "./components/portfolios/Zuber";
import InstallPWA from "./components/InstallPWA";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/student" element={<Login />} />
          <Route path="/dashBoard" element={<StudentDashBoard />} />
          <Route path="/role-based-login" element={<RoleBasedLogin />} />
          <Route path="/hod-dashboard" element={<HodDashboard />} />
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          <Route path="/principal-dashboard" element={<PrincipalDashboard />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-success" element={<ResetSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact-details" element={<Contact />} />
          <Route path="/team" element={<Team />} />
          <Route path="/rohan" element={<Rohan />} />
          <Route path="/zuber" element={<Zuber />} />
        </Routes>
      </BrowserRouter>
      <InstallPWA />
    </>
  );
};

export default App;
