import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/Loginpage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Departments from "./pages/Departments/Departments";
import Employees from "./pages/Employees/Employee";
import Designation from "./pages/Designation/Designation";
import LeaveManagement from "./pages/LeaveManagment/LeaveManagment";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/designations" element={<Designation />} />
      <Route path="/leave-management" element={<LeaveManagement />} />
    </Routes>
  );
}

export default App;