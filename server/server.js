require('dotenv').config()

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // use to parse body for post request from frontend

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

// signup customer (we can add validator here later)
app.post('/api/user/signup', async (req, res) => {
  const {email, password} = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO Customer (email, password) VALUES (?, ?)';
  db.query(sql, [email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const token = jwt.sign({email}, process.env.SECRET, { expiresIn: '1h' });

    res.status(200).json({email, token});
  })
})

// login customer
app.post('/api/user/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const checkUserQuery = 'SELECT * FROM Customer WHERE email = ?';
  db.query(checkUserQuery, [email], async (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Check if the user with the provided email exists
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // If the credentials are valid, generate a JWT
    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '1h' });

    res.status(200).json({ email, token });
  });
});

// Log server massage
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});