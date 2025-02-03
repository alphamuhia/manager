import React, { useState, useEffect } from "react";

const EmployeeDashboard = () => {
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/check_permission/");
        if (!response.ok) {
          throw new Error("Failed to check permission");
        }
        const data = await response.json();
        setPermissionGranted(data.permissionGranted);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, []);

  return (
    <div>
      <h1>Employee Dashboard</h1>

      {loading && <p>Checking permissions...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        permissionGranted ? (
          <div>
            <h2>Welcome to your dashboard!</h2>
          </div>
        ) : (
          <div style={{ color: "red", fontWeight: "bold" }}>
            You do not have permission to view this dashboard.
          </div>
        )
      )}
    </div>
  );
};

export default EmployeeDashboard;
