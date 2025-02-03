import React, { useState, useEffect } from "react";

const ManageEmployee = () => {
  const [employeeData, setEmployeeData] = useState({
    username: "",
    position: "",
    department: "",
  });
  const [departments, setDepartments] = useState([]);
//   const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/departments/");
        const data = await response.json();
        setDepartments(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    // const fetchPositions = async () => {
    //     try {
    //       const response = await fetch("http://127.0.0.1:8000/api/auth/positions/");
    //       const data = await response.json();
    //       setPositions(data);
    //       setLoading(false);
    //     } catch (error) {
    //       setError(error.message);
    //       setLoading(false);
    //     }
    //   };

    fetchDepartments();
    // fetchPositions();
  }, []);

  const handleChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(employeeData); 
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/employees/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create employee");
      }
  
      alert("Employee profile created successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div>
      <h1>Create Employee Profile</h1>
      {loading && <p>Loading departments...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={employeeData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* <div>
            <label>Position:</label>
            <select
              name="position"
              value={employeeData.position}
              onChange={handleChange}
              required
            >
              <option value="">Select Position</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>
          </div> */}

          <div>
            <label>Department:</label>
            <select
              name="department"
              value={employeeData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Create Profile</button>
        </form>
      )}
    </div>
  );
};

export default ManageEmployee;
