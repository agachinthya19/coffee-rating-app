import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Backend URL (Change this if you deploy to production)
const API_URL = 'http://localhost:5000/api';

function App() {
  const [coffees, setCoffees] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetchCoffees();
    fetchLeaderboard();
  }, []);

  const fetchCoffees = async () => {
    try {
      const res = await axios.get(`${API_URL}/coffees`);
      setCoffees(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching coffees", err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/leaderboard`);
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Error fetching leaderboard", err);
    }
  };

  // Vote Handler (Dynamic Update without full page refresh)
  const handleVote = async (id) => {
    try {
      const res = await axios.post(`${API_URL}/coffees/${id}/vote`);
      const updatedCoffee = res.data.updatedCoffee;

      // Update the grid state locally
      setCoffees(coffees.map(c => c.id === id ? updatedCoffee : c));
      
      // Re-fetch leaderboard to reflect new score
      fetchLeaderboard();
    } catch (err) {
      console.error("Error voting", err);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>☕ Coffee Rating App</h1>
        <p>Vote for your favorite blend!</p>
      </header>

      {/* Leaderboard Section */}
      <section className="leaderboard-section">
        <h2>🏆 Top Rated Blends</h2>
        <div className="leaderboard-list">
          {leaderboard.map((coffee, index) => (
            <div key={coffee.id} className="leaderboard-item">
              <span className="rank">#{index + 1}</span>
              <span className="name">{coffee.name}</span>
              <span className="score">⭐ {coffee.rating} ({coffee.votes} votes)</span>
            </div>
          ))}
        </div>
      </section>

      {/* Coffee Grid Section */}
      <section className="grid-section">
        <h2>All Blends</h2>
        {loading ? <p>Loading...</p> : (
          <div className="coffee-grid">
            {coffees.map(coffee => (
              <div key={coffee.id} className="coffee-card">
                <h3>{coffee.name}</h3>
                <p><strong>Origin:</strong> {coffee.origin}</p>
                <p><strong>Roast:</strong> {coffee.roast}</p>
                <div className="card-footer">
                  <div className="stats">
                    <span>⭐ {coffee.rating}</span>
                    <span>🗳️ {coffee.votes} votes</span>
                  </div>
                  <button 
                    className="vote-btn"
                    onClick={() => handleVote(coffee.id)}
                  >
                    Vote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;