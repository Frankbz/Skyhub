require('dotenv').config()

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// middleware
app.use(cors()); // Enable CORS for all routes

const db = mysql.createConnection({
    host: 'Localhost',
    user: 'root',
    password: '',
    database: 'airport',
  });


// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});


// Example route for handling a database query
app.get('/api/airline', (req, res) => {
  const sql = 'SELECT * FROM airline';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log(results)
    res.json(results);
  });
});

// Log server massage
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});