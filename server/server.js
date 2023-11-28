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


// signup customer 
app.post('/api/user/signup', async (req, res) => {
  const {email, password} = req.body;

  const type = "customer"

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO Customer (email, password) VALUES (?, ?)';
  db.query(sql, [email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const token = jwt.sign({email}, process.env.SECRET, { expiresIn: '1h' });

    res.status(200).json({type, email, token});
  })
})

// signup staff
app.post('/api/user/staff_signup', async (req, res) => {
  const { firstname, lastname, airline, email, password } = req.body;

  const type = "staff"

  // Check if the airline exists
  const checkAirlineQuery = 'SELECT airline_name FROM airline WHERE airline_name = ?';
  db.query(checkAirlineQuery, [airline], async (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking airline:', checkErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (checkResults.length === 0) {
      // Airline doesn't exist, return an error
      return res.status(400).json({ error: 'Airline does not exist' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the airline_staff table
    const insertQuery = 'INSERT INTO airline_staff (username, password, first_name, last_name, airline_name) VALUES (?, ?, ?, ?, ?)';
    db.query(insertQuery, [email, hashedPassword, firstname, lastname, airline], (insertErr, insertResults) => {
      if (insertErr) {
        console.error('Error executing insertion query:', insertErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '1h' });

      res.status(200).json({ type, email, token });
    });
  });
});


// login 
app.post('/api/user/login', async (req, res) => {
  const { type, email, password } = req.body;

  let tableName;
  let columnName;

  if (type === "staff"){
    tableName = "airline_staff";
    columnName = "username"
  }
  else{
    tableName = "customer"
    columnName = "email"
  }
  console.log(type, tableName, columnName)
  // Check if the user exists
  const checkUserQuery = `SELECT * FROM ${tableName} WHERE ${columnName} = ?`;
  db.query(checkUserQuery, [email], async (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Check if the user with the provided email exists
    if (results.length === 0) {
      return res.status(401).json({ error: ' Email not registered. Please sign up first.' });
    }

    // Compare the provided password with the hashed password in the database
    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    // If the credentials are valid, generate a JWT
    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '1h' });

    res.status(200).json({ type, email, token });
  });
});

/*  VIEW FLIGHTS
    User optionally provides date range, start and destination airports. Returns the search results of all flights from the airline that match the criteria.
    JSON:
    {
      start_date_range: datetime,
      end_date_range:   datetime,
      start_airport:    string,   OPTIONAL
      dest_airport:     string,   OPTIONAL
      start_city:       string,   OPTIONAL
      dest_city:        stirng,   OPTIONAL
    }
*/
app.post('/api/flights/view', async (req, res) => {
  const { start_date_range, end_date_range, start_airport, dest_airport, start_city, dest_city} = req.body;
  console.log(req.body)
  let query = "SELECT flight_ID, departure_datetime, arrival_datetime, base_price, flight_status, depart_airport_code, arrive_airport_code, B.city AS departure_city, A.city AS arrival_city, airplane_ID, airline_name, num_of_seats \
  FROM flight NATURAL JOIN flight_location JOIN Airport as A ON arrive_airport_code = A.airport_code JOIN Airport as B ON depart_airport_code = B.airport_code NATURAL JOIN flies NATURAL JOIN airplane\
  WHERE departure_datetime BETWEEN ";

  //Array to dynamically hold values for the prepared statement
  const values = [];
  if (start_date_range && end_date_range)
    if (start_date_range == end_date_range)

    values.push(start_date_range, end_date_range);

  //If query contains date range, use query's date range, otherwise use now to +30 days
  query += (start_date_range != end_date_range) ? ('? AND ?') : ('? AND DATE_ADD(?, INTERVAL 1 DAY)');
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

  //console.log(query);

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
      email:       string
    }
*/
app.post('/api/profile/tickets', async (req, res) => {
  const {email} = req.body;
  query = "SELECT * FROM ticket NATURAL JOIN flight NATURAL JOIN flight_location NATURAL JOIN flies WHERE payment_email = ?"

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(results);
    res.json(results);
  })
});


/*  Update Customer Info 
    User provides all customer information except for the password. Adds the provided information to the customer's account.
    JSON:
    {
      email:  string
      first_name:  string
      last_name:   string
      building:    string
      street:      string
      apartment:   string
      city:        string
      state:       string
      zipcode:     string
      card_type:   string
      card_number: string
      name_on_card:string
      card_exp_date:date
      passport_num:string
      passport_expr:date
      passport_country:string
      date_of_birth:date
    }
*/
app.put('/api/profile/update_info', async (req, res) =>{
  const {email, first_name, last_name, building, street, apartment, city, state, zipcode, card_type, card_number, name_on_card, card_exp_date, passport_num, passport_expr, passport_country, date_of_birth} = req.body;

  let query = 'UPDATE customer SET first_name = ?, last_name = ?, building = ?, street = ?, apartment = ?, city = ?, state = ?, zipcode = ?, \
  card_type = ?, card_number = ?, name_on_card = ?, card_exp_date = ?, passport_num = ?, passport_expr = ?, passport_country = ?, date_of_birth = ? \
  WHERE email = ?';

  db.query(query, [first_name, last_name, building, street, apartment, city, state, zipcode, card_type, card_number, name_on_card, card_exp_date, passport_num, passport_expr, passport_country, date_of_birth, email], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    //console.log("success");
    res.json(results);
  })
});

/*  Purchase Ticket
    User provides user's email, flight_ID and departure datetime of flight to purchase a ticket of, as well as the first/last name and DOB of who the ticket is intended for. Creates and returns a new ticket using the customer's info
    JSON:
    {
      email:              string
      flight_ID:          int
      departure_datetime: datetime
      first_name:         string
      last_name:          string
      date_of_birth:      date
    }
*/
app.post('/api/flights/purchase_ticket', async (req, res) =>{
  const {email, flight_ID, departure_datetime, first_name, last_name, date_of_birth} = req.body;
  let values;
  let price;
  //Gets the base price of the flight
  const flightQuery = "SELECT base_price FROM flight WHERE flight_ID = ? AND departure_datetime = ?";
  function executeQuery() {
    return new Promise((resolve, reject) =>{
      db.query(flightQuery, [flight_ID, departure_datetime], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          reject(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        price = results[0].base_price;
        console.log(price);
        resolve(price);
      });
    });
  }

  executeQuery() // run first query to find base_price
    .then((price)=> {
      values = [flight_ID, departure_datetime, price*1.25, first_name, last_name, date_of_birth, email];
      const query = "INSERT INTO ticket VALUES (0, ?, ?, ?, ?, ?, ?, ?, NOW())";

      //Second query to insert ticket with the correct values
      db.query(query, values, (err, results) => {           
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
      })
    });
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