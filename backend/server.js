// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// GET: Fetch all coffees (Grid Display)
app.get('/api/coffees', (req, res) => {
    db.all("SELECT * FROM coffees", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST: Increment Vote (Voting Mechanism)
app.post('/api/coffees/:id/vote', (req, res) => {
    const { id } = req.params;
    
    db.run("UPDATE coffees SET votes = votes + 1 WHERE id = ?", [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // Fetch the updated record to send back to UI
        db.get("SELECT * FROM coffees WHERE id = ?", [id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, updatedCoffee: row });
        });
    });
});

// GET: Leaderboard (Top Rated)
app.get('/api/leaderboard', (req, res) => {
    // Sorts by rating DESC, then votes DESC
    db.all("SELECT * FROM coffees ORDER BY rating DESC, votes DESC LIMIT 5", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));