import React, { useState, useEffect } from "react";

const Home = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if advertisements are already in local storage
    const storedAdvertisements = localStorage.getItem("advertisements");
    if (storedAdvertisements) {
      // If they exist in local storage, use them
      setAdvertisements(JSON.parse(storedAdvertisements));
      setLoading(false);
    } else {
      // If not, fetch from API
      const fetchAdvertisements = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/api/auth/advertisements/");
          if (!response.ok) {
            throw new Error("Failed to fetch advertisements");
          }
          const data = await response.json();
          setAdvertisements(data);
          localStorage.setItem("advertisements", JSON.stringify(data));
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchAdvertisements();
    }
  }, []);

  return (
    <div>
      <h1>Welcome to Our Company</h1>
      <h2>Our Products and Services</h2>
      {/* List the company's products and services here */}

      <div>
        <h2>Advertisements</h2>

        {loading && <p>Loading advertisements...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && !error && advertisements.length === 0 && <p>No advertisements available.</p>}

        {!loading && !error && advertisements.length > 0 && (
          <div style={{ display: "grid", gap: "10px" }}>
            {advertisements.map((ad) => (
              <div
                key={ad.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {ad.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
