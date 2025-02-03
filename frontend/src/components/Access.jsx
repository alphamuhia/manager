import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: ""});
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("login/", formData);
      console.log("Login successful:", response.data);

      const { access, role } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("role", role);

      switch (role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "manager":
          navigate("/manager-dashboard");
          break;
        case "employee":
          navigate("/employee-dashboard");
          break;
        default:
          navigate("/"); 
      }
    } catch (err) {
      if (err.response) {
        console.error("Backend error:", err.response.data);
        setError(err.response.data.detail || "Invalid username or password");
      } else if (err.request) {
        console.error("Network error:", err.request);
        setError("Network error: Unable to reach the server");
      } else {
        console.error("Error:", err.message);
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {/* <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium">Role</label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div> */}
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;