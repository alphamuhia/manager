import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './css/AdminDashboard.css';


const Card = ({ title, children }) => {
  return (
    <div className="card" style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <h3>{title}</h3>
      {children}
    </div>
  );
};

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch("http://127.0.0.1:8000/api/auth/employees/"),
          fetch("http://127.0.0.1:8000/api/auth/departments/"),
          fetch("http://127.0.0.1:8000/api/auth/announcement/"),
          fetch("http://127.0.0.1:8000/api/auth/notification/"),
          fetch("http://127.0.0.1:8000/api/auth/advertisements/"),
        ]);

        const data = await Promise.all(
          responses.map(async (response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch from ${response.url}: ${response.statusText}`);
            }
            return await response.json();
          })
        );

        const [employeesData, departmentsData, announcementsData, notificationsData, advertisementsData] = data;

        setEmployees(employeesData);
        setDepartments(departmentsData);
        setAnnouncements(announcementsData);
        setNotifications(notificationsData);
        setAdvertisements(advertisementsData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {loading && <p>Loading data...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && (
        <div className="card-container">
          
          <Card title="Departments">
            <Link to="/departments"><button>More</button></Link>
            <ul>
              {departments.map(department => (
                <li key={department.id}>{department.name}</li>
              ))}
            </ul>
          </Card>

          <Card title="Employees">
            <Link to="/list"><button>View Employee List</button></Link>
            <ul>
              {employees.map((employee) => (
                <li key={employee.id}>
                  {employee.username}
                </li>
              ))}
            </ul>
            {/* <button onClick={handleAddItem}>Add Employee</button> */}
          </Card>

          <Card title="Company Announcements">
            <ul>
              {announcements.map(announcement => (
                <li key={announcement.id}>{announcement.text}</li>
              ))}
            </ul>
          </Card>

          <Card title="Notifications from Employees">
            <ul>
              {notifications.map(notification => (
                <li key={notification.id}>{notification.message}</li>
              ))}
            </ul>
          </Card>

          <Card title="Advertisements">
            <ul>
              {advertisements.map(ad => (
                <li key={ad.id}>{ad.content}</li>
              ))}
            </ul>
          </Card>

          <Card title="Employee Salary">
            <ul>
              {employees.map(employee => (
                <li key={employee.id}>
                  {employee.username}: ${employee.salary}
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Reminders">
            <textarea
              placeholder="Add a reminder here..."
              onChange={(e) => setReminders([...reminders, e.target.value])}
              value={reminders.join("\n")}
              rows={4}
              cols={50}
            />
            <button onClick={() => alert("Reminder added")}>Add Reminder</button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
