import React, { useState, useEffect } from 'react';
import './css/Department.css';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/departments/');
        if (!response.ok) throw new Error('Failed to fetch departments');
        const data = await response.json();
        setDepartments(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchDepartmentDetails = async () => {
      if (!selectedDepartment) return;
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/departments/${selectedDepartment}/`);
        if (!response.ok) throw new Error('Failed to fetch department details');
        const data = await response.json();
        setEmployees(data.employees || []);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchDepartmentDetails();
  }, [selectedDepartment]);

  useEffect(() => {
    const fetchAvailableEmployees = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/employees/');
        if (!response.ok) throw new Error('Failed to fetch employees');
        const data = await response.json();
        setAvailableEmployees(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchAvailableEmployees();
  }, []);

  const handleAddDepartment = async () => {
    if (!newDepartmentName) return alert('Please provide a department name');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/departments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDepartmentName }),
      });
      if (!response.ok) throw new Error('Failed to add department');
      const newDepartment = await response.json();
      setDepartments([...departments, newDepartment]);
      setNewDepartmentName('');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auth/departments/${id}/`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete department');
      setDepartments(departments.filter(department => department.id !== id));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedDepartment || !selectedEmployee) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auth/departments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: parseInt(selectedEmployee) }),
      });
      if (!response.ok) throw new Error('Failed to assign employee');
      const updatedEmployee = availableEmployees.find(emp => emp.id === parseInt(selectedEmployee));
      setEmployees((prevEmployees) => [...prevEmployees, updatedEmployee]);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <nav>
        {/* <button><a href="/departments">Back</a></button> */}
        <button><a href="/admin">Back to Admin</a></button>
      </nav>
      <h1>Department Management</h1>
      {loading && <p>Loading data...</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !error && (
        <div className="department-container">
          <div className="department-list">
            <h2>Departments</h2>
            <ul>
              {departments.map(department => (
                <li key={department.id}>
                  {department.name}
                  <button onClick={() => handleDeleteDepartment(department.id)}>Delete</button>
                  <button onClick={() => setSelectedDepartment(department.id)}>View Details</button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              placeholder="New department name"
            />
            <button onClick={handleAddDepartment}>Add Department</button>
          </div>
          <div className="department-details">
            {selectedDepartment ? (
              <div className="department-card">
                <h2>Department Details</h2>
                <p><strong>Department Name:</strong> {departments.find(d => d.id === selectedDepartment)?.name}</p>
                <h3>Employees in this department</h3>
                <ul>
                  {employees.length > 0 ? (
                    employees.map(emp => (
                      <li key={emp.id}>{emp.username} - {emp.role}</li>
                    ))
                  ) : (
                    <p>No employees assigned yet</p>
                  )}
                </ul>
                <h3>Assign Employee</h3>
                <select onChange={(e) => setSelectedEmployee(e.target.value)}>
                  <option value="">Select an employee</option>
                  {availableEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.username}</option>
                  ))}
                </select>
                <button onClick={handleAssignEmployee}>Assign</button>
              </div>
            ) : (
              <p>Select a department to view details</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
