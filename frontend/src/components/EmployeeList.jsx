import React, { useState, useEffect } from "react";
import './css/EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    address: "",
    department: "",
    position: "",
    salary: ""
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/employees/");
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setEmployees(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      fullName: employee.fullName,
      idNumber: employee.idNumber,
      address: employee.address,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
    });
  };

  const handleEditProfile = () => {
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auth/employees/${selectedEmployee.id}/profile/`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update employee profile");

      alert("Employee profile updated successfully!");
      setShowForm(false); 
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/employees/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error("Failed to add employee");
  
      const data = await response.json();
      alert("Employee added successfully!");
      setEmployees((prevEmployees) => [...prevEmployees, data]);
      setShowForm(false);  
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="employee-list-container">
      <h1>Employee List</h1>
       <button className="add-employee-btn" onClick={handleAddEmployee}>
              Add Employee
        </button>

      {loading && <p>Loading data...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && (
        <>
          <ul className="employee-list">
            {employees.length > 0 ? (
              employees.map((employee) => (
                <li key={employee.id} className="employee-item">
                  <span>{employee.username}</span>
                  <button
                    className="view-details-btn"
                    onClick={() => handleViewDetails(employee)}
                  >
                    View Details
                  </button>
                </li>
              ))
            ) : (
              <p>No employees available.</p>
            )}
          </ul>

          {/* {employees.length === 0 && (
            <button className="add-employee-btn" onClick={handleAddEmployee}>
              Add Employee
            </button>
          )} */}
        </>
      )}

      {selectedEmployee && !showForm && (
        <div className="employee-details">
          <h2>Employee Details</h2>
          <p><strong>Full Name:</strong> {selectedEmployee.fullName}</p>
          <p><strong>ID Number:</strong> {selectedEmployee.idNumber}</p>
          <p><strong>Address:</strong> {selectedEmployee.address}</p>
          <p><strong>Department:</strong> {selectedEmployee.department}</p>
          <p><strong>Position:</strong> {selectedEmployee.position}</p>
          <p><strong>Salary:</strong> ${selectedEmployee.salary}</p>
          <button onClick={handleEditProfile}>Edit Profile</button>
        </div>
      )}

{showForm && !selectedEmployee && (
  <div className="employee-form">
    <h2>Add New Employee</h2>
    <form onSubmit={handleAddEmployee}>
      <div>
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>ID Number</label>
        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Department</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Position in Department</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Salary</label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Add Employee</button>
      <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
    </form>
  </div>
)}
    </div>
  );
};

export default EmployeeList;
