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
    To check past flights, pass any value into the "past" parameter
    JSON:
    {
      start_date_range: datetime, OPTIONAL
      end_date_range:   datetime, OPTIONAL
      start_airport:    string,   OPTIONAL
      dest_airport:     string,   OPTIONAL
      start_city:       string,   OPTIONAL
      dest_city:        string,   OPTIONAL
      past:             string,     OPTIONAL
    }
*/
app.post('/api/flights/view', async (req, res) => {
  const { start_date_range, end_date_range, start_airport, dest_airport, start_city, dest_city, past} = req.body;
  console.log(req.body)
  let query = "SELECT flight_ID, departure_datetime, arrival_datetime, base_price, flight_status, depart_airport_code, arrive_airport_code, B.city AS departure_city, A.city AS arrival_city, airplane_ID, airline_name, num_of_seats \
  FROM flight NATURAL JOIN flight_location JOIN Airport as A ON arrive_airport_code = A.airport_code JOIN Airport as B ON depart_airport_code = B.airport_code NATURAL JOIN flies NATURAL JOIN airplane\
  WHERE departure_datetime";

  //Array to dynamically hold values for the prepared statement
  const values = [];
  if (start_date_range && end_date_range)
    values.push(start_date_range, end_date_range);

  //If query includes past (any value, as long as it exists in the query), return only flights that have already departed
  if(past){
    query += ' < NOW()';
    //console.log("past");
  }
  //If query contains date range, use query's date range, otherwise use now to +30 days
  else if (start_date_range && end_date_range)
    query += (start_date_range != end_date_range) ? (' BETWEEN ? AND ?') : (' BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)');
  else
    query += ' BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY)';

  //Checks start/dest airport and city if passed in
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
    //console.log(results);
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
    //console.log(results);
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
  //Gets the base price of the flight
  function findTicketPrice() {
    return new Promise((resolve, reject) =>{
      let price;
      let seats;
      let final_price;
      const flightQuery = "SELECT base_price, num_of_seats FROM flight NATURAL JOIN flies NATURAL JOIN airplane WHERE flight_ID = ? AND departure_datetime = ?";
      db.query(flightQuery, [flight_ID, departure_datetime], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          reject(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!results[0]){
          console.error('No such flight found!');
          return res.status(500).json({ error: 'No Such Flight Found' });
        }
        price = results[0].base_price;
        seats = results[0].num_of_seats;
        console.log(price);
        console.log(seats);
      });

      const seatQuery = "SELECT count(*) as seats_taken FROM ticket WHERE flight_ID = ? AND departure_datetime = ?"
      db.query(seatQuery, [flight_ID, departure_datetime], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          reject(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!results[0]){
          console.error('No such flight found!');
          return res.status(500).json({ error: 'No Such Flight Found' });
        }
        console.log(results[0].seats_taken);
        final_price = (results[0].seats_taken/seats > 0.8) ? price * 1.25 : price;
        console.log(final_price);
        resolve(final_price);
      });
    });
  }

  findTicketPrice() // run first query to find base_price
    .then((price)=> {
      values = [flight_ID, departure_datetime, price, first_name, last_name, date_of_birth, email];
      const query = "INSERT INTO ticket VALUES (0, ?, ?, ?, ?, ?, ?, ?, NOW())";

      //Second query to insert ticket with the correct values
      db.query(query, values, (err, results) => {           
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log(results);
        res.json(results);
      })
    });
});

/*  DELETE TICKET
    User passes in a ticket ID and the user's email. The ticket will be removed if the flight for the ticket is more than 24 hours away.
    JSON:
    {
      email:     string
      ticket_ID: int
    }
*/
app.delete('/api/flights/delete_ticket', async (req, res) =>{
  const {email, ticket_ID} = req.body;
  const query = 'DELETE FROM ticket WHERE ticket_ID = ? AND payment_email = ? AND departure_datetime > DATE_ADD(NOW(), INTERVAL 1 DAY)';

  db.query(query, [ticket_ID, email], (err, results) => {           
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const rowsAffected = results.affectedRows;
    if (rowsAffected > 0)   
      res.json({ success: true, message: 'Successfully removed ticket'});
    else  
      res.json({ success: false, message: 'You can not refund tickets less than 24 hours before the flight'});
  })
});

/*  TRACK SPENDING
    User passes in user's email, and optionally passes in a date range. Returns 3 columns - year, month, and monthly_sum.
    JSON:
    {
      email:        string
      start_date:   date (OPTIONAL, default = 6 months ago)
      end_date:     date (OPTIONAL, default = CURR_DATE())
    }

*/
app.post('/api/profile/get_spending', async (req,res) =>{
  const {email, start_date, end_date} = req.body;
  let values = [email];
  let query = "SELECT YEAR(purchases_datetime) AS year, MONTH(purchases_datetime) AS month, SUM(ticket_price) AS monthly_sum \
  FROM ticket WHERE payment_email = ? AND purchases_datetime BETWEEN";
  if (start_date){
    query += " ? AND";
    values.push(start_date);
    console.log(start_date);
  }
  else 
    query += " CURDATE() - INTERVAL 6 MONTH AND";

  if (end_date){
    query += " ?";
    values.push(end_date);
    console.log(end_date);
  }
  else
    query += " NOW()";
  
  query += " GROUP BY YEAR(purchases_datetime), MONTH(purchases_datetime) ORDER BY YEAR(purchases_datetime) DESC, MONTH(purchases_datetime) DESC";
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(results);
    res.json(results);
  })

});

/*  CREATE COMMMENT AND RATING
    User passes in the user's email, and either a comment, rating, or both. Creates a comment/rating pair with the comment and rating
    JSON:
    {
      email:              string
      flight_ID:          int
      departure_datetime: datetime
      comment:            string (1000 chars MAX)
      rating:             int
    }
*/
app.post('/api/comment/create', async (req, res) =>{
  const {email, flight_ID, departure_datetime, comment, rating} = req.body;
  const commentSQL = 'INSERT INTO comment VALUES (?, ?, ?, ?)';
  const ratingSQL = 'INSERT INTO rating VALUES (?, ?, ?, ?)';
  db.query(commentSQL, [email, flight_ID, departure_datetime, comment], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  })
  db.query(ratingSQL, [email, flight_ID, departure_datetime, rating], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  })
});

/*  ADD PHONE NUMBER
    User passes in the user's email, and a phone number. Stores the phone number in the database to the user.
    JSON:
    {
      email:        string
      phone_number: string
    }
*/
app.post('/api/profile/add_phone', async (req, res) =>{
  const {email, phone_number} = req.body;
  const query = 'INSERT INTO customer_phone VALUES (?, ?)';
  db.query(query, [email, phone_number], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
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