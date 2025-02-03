import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Home from "./components/Home";
import Login from "./components/Access";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Navbar from "./components/Navbar";
import ManageDepartments from "./components/ManageDepartments";
import ManageEmployee from "./components/ManageEmployee";
import EmployeeList from "./components/EmployeeList";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/departments" element={<ProtectedRoute element={<ManageDepartments />} />} />
          <Route path="/list" element={<ProtectedRoute element={<EmployeeList />} />} />
          <Route path="/manage-employee" element={<ProtectedRoute element={<ManageEmployee />} />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
          <Route path="/employee" element={<ProtectedRoute element={<EmployeeDashboard />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
