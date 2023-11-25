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

/*  VIEW FLIGHTS
    User optionally provides date range, start and destination airports. Returns the search results of all flights from the airline that match the criteria.
    JSON:
    {
      start_date_range: datetime, OPTIONAL
      end_date_range:   datetime, OPTIONAL
      start_airport:    string,   OPTIONAL
      dest_airport:     string,   OPTIONAL
      start_city:       string,   OPTIONAL
      dest_city:        stirng,   OPTIONAL
    }
*/
app.post('/api/flights/view', async (req, res) => {
  const { start_date_range, end_date_range, start_airport, dest_airport, start_city, dest_city} = req.body;

  let query = "SELECT flight_ID, departure_datetime, arrival_datetime, base_price, flight_status, depart_airport_code, arrive_airport_code, B.city AS departure_city, \
  A.city AS arrival_city \
   FROM flight NATURAL JOIN flight_location JOIN Airport as A ON arrive_airport_code = A.airport_code JOIN Airport as B ON depart_airport_code = B.airport_code \
  WHERE departure_datetime BETWEEN ";

  //Array to dynamically hold values for the prepared statement
  const values = [];
  if (start_date_range && end_date_range)
    values.push(start_date_range, end_date_range);

  //If query contains date range, use query's date range, otherwise use now to +30 days
  query += (start_date_range && end_date_range) ? ('? AND ?') : ('NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY)');
  if (start_airport){
    query += ' AND depart_airport_code = ?';
    values.push(start_airport);}
  if (dest_airport){
    query += ' AND arrive_airport_code = ?';
    values.push(dest_airport);}
  if (start_city){
    query += ' AND B.city = ?';
    values.push(start_city);}
  if (dest_city){
    query += ' AND A.city = ?';
    values.push(dest_city);}

  console.log(query);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(results);
    res.json(results);
  })
});

/*  GET TICKETS
    User provides the user's email. Returns all tickets purchased by the user.
    JSON:
    {
      email:  string
    }
*/
app.post('/api/profile/tickets', async (req, res) => {
  const {email} = req.body;
  query = "SELECT * FROM ticket WHERE payment_email = ?"

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(results);
    res.json(results);
  })
});

// UNFINISHED
// /*  Create New Flight
//     User provides information for a new flight, a new flight is created under the user's airline
//     JSON FORMAT
//     {
//       departure_datetime:   datetime
//       arrival_datetime:     datetime
//       start_airport:        string
//       dest_airport:         string
//       base_price:           float
//       airplane_ID:          int
//     }
//     TODO set flight_ID to AUTO_INCREMENT in the database column?, and check that airplane being used is of the correct airline
// */
// app.post('/api/flights/create', (req, res) => {
//   console.log('entered flights route');
//   const{ departure_datetime, arrival_datetime, start_airport, dest_airport, base_price, airplane_ID} = req.body;
//   //flight_ID is auto generated, flight_status always 'on-time'
//   const flight_ID = 123; const status = 'on-time';  
//   const flightSQL = 'INSERT INTO flight (flight_ID, departure_datetime, arrival_datetime, base_price, flight_status) VALUES (?, ?, ?, ?, ?)';
//   const locationSQL = 'INSERT INTO flight_location (flight_ID, departure_datetime, start_airport_code, dest_airport_code) VALUES (?, ?, ?, ?)';
//   const airplaneSQL = 'INSERT INTO flies (flight_ID, departure_datetime, airplane_ID) VALUES (?, ?, ?)';

//   //Insert into flight table
//   db.query(flightSQL, [flight_ID, departure_datetime, arrival_datetime, base_price, airplane_ID], (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })
//   db.query(locationSQL, [flight_ID, departure_datetime, start_airport, dest_airport], (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })
//   db.query(airplaneSQL, [flight_ID, departure_datetime, airplane_ID], (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })
//   res.send("Successfully created flight");
// });

// /*  Change Flight Status
//     User provides a flight_ID & departure datetime, and the flight status to be updated to
// */
// app.patch('/api/flights/change_status', (req, res) => {
//   const { flight_ID, departure_datetime, flight_status } = req.body;

//   sql = 'UPDATE flight SET flight_status = ? WHERE flight_ID = ?, departure_datetime = ?';
//   db.query(sql, [flight_status, flight_ID, departure_datetime], (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//     res.send("Successfully updated flight status");
//   })
// });



// Log server massage
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});