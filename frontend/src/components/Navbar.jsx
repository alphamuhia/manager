// Navbar.js
import React from 'react';
import './css/Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/admin" className="navbar-logo">Dashboard</a>
        <ul className="navbar-links">
          <li><a href="/departments">Departments</a></li>
          {/* <li><a href="#employees">Employees</a></li>
          <li><a href="#announcements">Announcements</a></li>
          <li><a href="#notifications">Notifications</a></li>
          <li><a href="#advertisements">Advertisements</a></li>
          <li><a href="#salary">Salary</a></li>
          <li><a href="#reminders">Reminders</a></li> */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
