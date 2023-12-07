require('dotenv').config()

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');

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
  const airline_name = null

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO Customer (email, password) VALUES (?, ?)';
  db.query(sql, [email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const token = jwt.sign({email}, process.env.SECRET, { expiresIn: '1h' });

    res.status(200).json({type, email, token, airline_name});
  })
})

// signup staff
app.post('/api/user/staff_signup', async (req, res) => {
  const { firstname, lastname, airline, email, password } = req.body;

  const type = "staff"
  const airline_name = airline;

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

      res.status(200).json({ type, email, token, airline_name });
    });
  });
});


// login 
app.post('/api/user/login', async (req, res) => {
  const { type, email, password } = req.body;

  let tableName;
  let columnName;
  let airline_name;

  if (type === "staff") {
    tableName = "airline_staff";
    columnName = "username"; 
    // Fetch airline_name from airline_staff where email and password match
    const fetchAirlineQuery = `SELECT * FROM ${tableName} WHERE ${columnName} = ?`;
    db.query(fetchAirlineQuery, [email, password], (error, airlineResults) => {
      if (error) {
        console.error('Error fetching airline_name:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Check if the user with the provided email and password exists
      if (airlineResults.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      airline_name = airlineResults[0].airline_name;

      // Continue with the rest of the login logic
      continueLogin();
    });
  } else {
    tableName = "customer";
    columnName = "email";
    airline_name = null;
    // Continue with the rest of the login logic
    continueLogin();
  }

  function continueLogin() {
    // Check if the user exists
    const checkUserQuery = `SELECT * FROM ${tableName} WHERE ${columnName} = ?`;
    db.query(checkUserQuery, [email], async (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Check if the user with the provided email exists
      if (results.length === 0) {
        return res.status(401).json({ error: 'Email not registered. Please sign up first.' });
      }

      // Compare the provided password with the hashed password in the database
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Password is incorrect' });
      }

      // If the credentials are valid, generate a JWT
      const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '1h' });

      res.status(200).json({ type, email, token, airline_name });
    });
  }
});



//////////////////////////////////////
//CUSTOMER ROUTES

/*  View Flights
    User optionally provides date range, start and destination airports. Returns the search results of all flights from the airline that match the criteria. Flights must occur in the future
    JSON:
    {
      start_date_range: datetime, OPTIONAL
      end_date_range:   datetime, OPTIONAL
      start_airport:    string,   OPTIONAL
      dest_airport:     string,   OPTIONAL
      start_city:       string,   OPTIONAL
      dest_city:        string,   OPTIONAL
    }
*/
app.post('/api/flights/view', async (req, res) => {
  const { start_date_range, end_date_range, start_airport, dest_airport, start_city, dest_city} = req.body;

  let query = "SELECT flight_ID, departure_datetime, arrival_datetime, flight_status, depart_airport_code, arrive_airport_code, B.city AS departure_city, A.city AS arrival_city, airplane_ID, airline_name, remaining_seats AS num_of_seats, \
  CASE WHEN remaining_seats/num_of_seats > 0.2 THEN base_price ELSE base_price*1.25 END AS base_price \
  FROM flight NATURAL JOIN flight_location JOIN Airport as A ON arrive_airport_code = A.airport_code JOIN Airport as B ON depart_airport_code = B.airport_code NATURAL JOIN flies NATURAL JOIN airplane\
  WHERE departure_datetime > NOW() AND remaining_seats > 0";

  //Array to dynamically hold values for the prepared statement
  const values = [];
  if (start_date_range && end_date_range)
    values.push(start_date_range, end_date_range);
  if (start_date_range && end_date_range)
    query += (start_date_range != end_date_range) ? ('AND departure_datetime BETWEEN ? AND ?') : ('AND departure_datetime BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)');

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

/*  Get Tickets
    User provides the user's email. Returns all tickets purchased by the user.
    JSON:
    {
      email:       string
    }
*/
app.post('/api/profile/tickets', async (req, res) => {
  const {email} = req.body;
  query = "SELECT flight_ID, departure_datetime, arrival_datetime, flight_status, depart_airport_code, arrive_airport_code, airplane_ID, airline_name, remaining_seats as num_of_seats, ticket_ID, ticket_price AS base_price\
  FROM ticket NATURAL JOIN flight NATURAL JOIN flight_location NATURAL JOIN flies NATURAL JOIN airplane WHERE payment_email = ?"

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
  const flightQuery = "SELECT CASE WHEN remaining_seats/num_of_seats > 0.2 THEN base_price ELSE base_price*1.25 END AS final_price FROM flight NATURAL JOIN flies NATURAL JOIN airplane WHERE flight_ID = ? AND departure_datetime = ?";
  const newTicketQuery = "INSERT INTO ticket VALUES (0, ?, ?, ?, ?, ?, ?, ?, NOW())";
  const updateSeatQuery = "UPDATE flight SET remaining_seats = remaining_seats-1 WHERE flight_ID = ? AND departure_datetime = ?";

  const query = util.promisify(db.query).bind(db);
  // Find base_price, remaining_seats and num_of_seats, use to calculate final price 
  console.log(flightQuery);
  const results1 = await query(flightQuery, [flight_ID, departure_datetime]);
  console.log(results1);
  const final_price = parseFloat(results1[0].final_price);
  // Second query to insert ticket with the correct values
  const values = [flight_ID, departure_datetime, final_price, first_name, last_name, date_of_birth, email];
  await query(newTicketQuery, values);

  // Third query to update remaining seats
  await query(updateSeatQuery, [flight_ID, departure_datetime]);

});

/*  Delete Ticket
    User passes in a ticket ID and the user's email. The ticket will be removed if the flight for the ticket is more than 24 hours away.
    JSON:
    {
      email:     string
      ticket_ID: int
    }
*/
app.delete('/api/flights/delete_ticket', async (req, res) =>{
  const {email, ticket_ID} = req.body;
  const getFlightQuery = "SELECT flight_ID, departure_datetime FROM flight NATURAL JOIN ticket WHERE ticket_ID = ? AND departure_datetime > DATE_ADD(NOW(), INTERVAL 1 DAY)";
  const delTicketQuery = "DELETE FROM ticket WHERE ticket_ID = ? AND payment_email = ? AND departure_datetime > DATE_ADD(NOW(), INTERVAL 1 DAY)";
  const updateSeatQuery = "UPDATE flight SET remaining_seats = remaining_seats+1 WHERE flight_ID = ? AND departure_datetime = ?";

  const query = util.promisify(db.query).bind(db);
  
  // Gets flight details from the ticket information
  console.log(ticket_ID);
  const results1 = await query(getFlightQuery, [ticket_ID]);
  console.log(results1);

  // Uses flight details to increase available seats on the flight by 1 (if the ticket can be removed)
  if (results1){
    db.query(updateSeatQuery, [results1[0].flight_ID, results1[0].departure_datetime], (err, results) => {           
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    })
  }

  // Deletes the ticket from the database
  db.query(delTicketQuery, [ticket_ID, email], (err, results) => {           
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

/*  Track Spending
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

/*  Create Comment and Rating
    User passes in the user's email, a rating, and optionally a comment, as well as the flight ID and flight departure datetime of the flight being rated/commented on. 
    Creates a rating and comment in the database under said flight.
    JSON:
    {
      email:              string
      flight_ID:          int
      departure_datetime: datetime
      comment:            string (1000 chars MAX) OPTIONAL
      rating:             int
    }
*/
app.post('/api/comment/create', async (req, res) =>{
  const {email, flight_ID, departure_datetime, comment, rating} = req.body;
  let commentSQL;
  let ratingSQL;
  const checkRateSQL = 'SELECT * FROM rating WHERE email = ? AND flight_ID = ? AND departure_datetime = ?';
  const checkCommentSQL = 'SELECT * FROM comment WHERE email = ? AND flight_ID = ? AND departure_datetime = ?';
  const query = util.promisify(db.query).bind(db);


  // Check if the rating already exists - if so, update it, if not, create a new one
  const results1 = await query(checkRateSQL, [email, flight_ID, departure_datetime]);
  if(results1[0])
    ratingSQL = 'UPDATE rating SET rating = ? WHERE email = ? AND flight_ID = ? AND departure_datetime = ?';
  else
    ratingSQL = 'INSERT INTO rating (rating, email, flight_ID, departure_datetime) VALUES (?, ?, ?, ?)';
  db.query(ratingSQL, [rating, email, flight_ID, departure_datetime], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });

  // Check if the comment already exists - if so, update it, if not, create a new one
  if (comment){
    const results2 = await query(checkCommentSQL, [email, flight_ID, departure_datetime]);
    if (results2[0])
      commentSQL = 'UPDATE comment SET comment = ? WHERE email = ? AND flight_ID = ? AND departure_datetime = ?';
    else
      commentSQL = 'INSERT INTO comment (comment, email, flight_ID, departure_datetime) VALUES (?, ?, ?, ?)';
    db.query(commentSQL, [comment, email, flight_ID, departure_datetime], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }
});

/*  Add Phone Number
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




//////////////////////////////////////
//AIRLINE STAFF ROUTES

/*  View Airline Flights
    User provides their airline, and optionally a range of dates, src/dst airports, src/dst cities. Provides all flights matching the criteria.
    Default date range is current time to next 30 days
    JSON:
    {
      airline_name:     string
      start_date_range: datetime, OPTIONAL
      end_date_range:   datetime, OPTIONAL
      start_airport:    string,   OPTIONAL
      dest_airport:     string,   OPTIONAL
      start_city:       string,   OPTIONAL
      dest_city:        string,   OPTIONAL
    }
*/
app.post('/api/staff/view_flights', async (req, res) =>{
  const {airline_name, start_date_range, end_date_range, start_airport, dest_airport, start_city, dest_city} = req.body;

  let query = "SELECT flight_ID, departure_datetime, arrival_datetime, flight_status, depart_airport_code, arrive_airport_code, B.city AS departure_city, A.city AS arrival_city, airplane_ID, airline_name, remaining_seats AS num_of_seats, \
  CASE WHEN remaining_seats/num_of_seats > 0.2 THEN base_price ELSE base_price*1.25 END AS base_price \
  FROM flight NATURAL JOIN flight_location JOIN Airport as A ON arrive_airport_code = A.airport_code JOIN Airport as B ON depart_airport_code = B.airport_code NATURAL JOIN flies NATURAL JOIN airplane\
  WHERE airline_name = ? AND departure_datetime";

  //Array to dynamically hold values for the prepared statement
  const values = [airline_name];
  if (start_date_range && end_date_range)
    values.push(start_date_range, end_date_range);
  //If query contains date range, use query's date range, otherwise use now to +30 days
  if (start_date_range && end_date_range)
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

/*  View Flight Customers
    User provides flight_ID and departure_datetime of a flight. Returns all customers of said flight.
    JSON:
    {
      flight_ID:          int
      departure_datetime: datetime
    }
*/
app.post('/api/flights/view_customers', async (req, res)=>{
  const {flight_ID, departure_datetime} = req.body;
  query = "SELECT * FROM ticket WHERE flight_ID = ? AND departure_datetime = ?";
  console.log(query);
  db.query(query, [flight_ID, departure_datetime], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(results);
    res.json(results);
  })
});


/*  Create New Flight
    User provides information for a new flight, a new flight is created under the user's airline
    A plane with airline_name and airplane_ID must exist in the database, and the flight date must NOT coincide with any maintenance periods for said airplane
    JSON FORMAT
    {
      airline_name:         string
      departure_datetime:   datetime
      arrival_datetime:     datetime
      start_airport:        string
      dest_airport:         string
      base_price:           float
      airplane_ID:          int
    }
*/
app.post('/api/flights/create', async (req, res) => {
  const{ airline_name, departure_datetime, arrival_datetime, start_airport, dest_airport, base_price, airplane_ID} = req.body;
  //Intermediate query - find number of seats, look for any conflicting maintenance periods
  const findSeatSQL = 'SELECT num_of_seats FROM Airplane WHERE airline_name = ? AND airplane_ID = ?';
  const findFlightsMaintenanceSQL = 'SELECT * FROM airplane_maintenance WHERE airplane_ID = ? AND airline_name = ? AND (? < start_datetime AND ? > start_datetime) OR (? < end_datetime AND ? > end_datetime) ';

  //flight_ID is auto generated, flight_status always 'on-time'
  const flightSQL = 'INSERT INTO flight (departure_datetime, arrival_datetime, base_price, remaining_seats, flight_status) VALUES (?, ?, ?, ?, "on-time")';
  const locationSQL = 'INSERT INTO flight_location (flight_ID, departure_datetime, depart_airport_code, arrive_airport_code) VALUES (?, ?, ?, ?)';
  const airplaneSQL = 'INSERT INTO flies (flight_ID, departure_datetime, airplane_ID, airline_name) VALUES (?, ?, ?, ?)';

  const query = util.promisify(db.query).bind(db);
  //Search for conflicting maintenance periods
  const results1 = await query(findFlightsMaintenanceSQL, [airplane_ID, airline_name, departure_datetime, arrival_datetime, departure_datetime, arrival_datetime]);
  if (results1[0]){
    console.log(results1[0]);
    res.json({success: false, message: "Conflicting flight time period with plane maintenance period!"});
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  //Find number of seats
  const results2 = await query(findSeatSQL, [airline_name, airplane_ID]);
  if (!results2[0]){
    res.json({success: false, message: "Airplane used does not exist!"});
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  //Insert into flight table, save the ID being inserted
  const results3 = await query(flightSQL, [departure_datetime, arrival_datetime, base_price, results2[0].num_of_seats]);
  const flight_ID = results3.insertId;

  //Insert into flight_location table
  await query(locationSQL, [flight_ID, departure_datetime, start_airport, dest_airport]);
  //Insert into flies table
  await query(airplaneSQL, [flight_ID, departure_datetime, airplane_ID, airline_name]);
  res.json({success: true, message: "successfully created flight"});
});

/*  Change Flight Status
    User provides a flight_ID & departure datetime, and the flight status to be updated to.
    JSON:
    {
      flight_ID:            int
      departure_datetime:   datetime
      flight_status:        string
    }
*/
app.patch('/api/flights/change_status', (req, res) => {
  const { flight_ID, departure_datetime, flight_status } = req.body;

  sql = 'UPDATE flight SET flight_status = ? WHERE flight_ID = ? AND departure_datetime = ?';
  db.query(sql, [flight_status, flight_ID, departure_datetime], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  })
});

/*  Add Airplane
    User provides airline_name, number of seats, manufacturing company, model number, and age. Inserts the plane into the database.
    JSON:
    {
      airline_name:         string
      num_of_seats:         int
      manufacturing_company:string
      model_number:         string
      age:                  int  
    }
*/
app.post('/api/staff/add_plane', async (req, res) =>{
  const {airline_name, num_of_seats, manufacturing_company, model_number, age} = req.body;
  const query = 'INSERT INTO airplane (airplane_ID, num_of_seats, manufacturing_company, model_number, age, airline_name) VALUES (0, ?, ?, ?, ?, ?)';
  db.query(query, [num_of_seats, manufacturing_company, model_number, age, airline_name], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  })
});

/*  Add Staff Email and/or Number
    User passes in the user's airline_name, username, and optionally a phone number and/or email. Stores the phone number/email in the database to the user.
    JSON:
    {
      airline_name: string
      username:     string
      phone_number: string (OPTIONAL)
      email:        string (OPTIONAL)
    }
*/
app.post('/api/staff/add_phone_email', async (req, res) =>{
  const {airline_name, username, phone_number, email} = req.body;
  if (phone_number){
    const phonequery = 'INSERT INTO staff_phone VALUES (?, ?, ?)';
    db.query(phonequery, [username, airline_name, phone_number], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }

  if (email){
    const emailquery = 'INSERT INTO staff_email VALUES (?, ?, ?)';
    db.query(emailquery, [username, airline_name, email], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }
  res.json({success: true, message: "successfully added phone number/"});
});

/*  Add Airport
    User passes in all details of an airport. The airport is stored in the database.
    JSON:
    {
      airport_code:   string(len=3)
      name:           string
      city:           string
      country:        string
      num_of_terminals:int
      airport_type:   string
    }
*/
app.post('/api/staff/add_airport', async (req, res) =>{
  const {airport_code, name, city, country, num_of_terminals, airport_type} = req.body;
  const query = 'INSERT INTO airport VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [airport_code, name, city, country, num_of_terminals, airport_type], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  })
});

/*  View Ratings
    User passes in a flight_ID and departure_datetime. Returns a list of ratings and corresponding comments from customers for that flight, along with their account emails.
    JSON:
    {
      flight_ID:          int
      departure_datetime: datetime
    }
*/
app.post('/api/staff/view_ratings', async (req, res) =>{
  const {flight_ID, departure_datetime} = req.body;
  console.log(req.body)
  const query = 'SELECT email, rating, comment FROM rating NATURAL LEFT JOIN comment WHERE flight_ID = ? AND departure_datetime = ?';
  db.query(query, [flight_ID, departure_datetime], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(results)
    res.json(results);
  })
});

/*  Schedule Maintenance Period
    User passes in a date range and the plane_ID and airline_name of the affected plane. Enters a maintenance period for that plane.
    JSON:
    {
      airplane_ID:    int
      airline_name:   string
      start_datetime: datetime
      end_datetime:   datetime
    }
*/
app.post('/api/staff/add_maintenance', async (req, res) =>{
  const {airplane_ID, airline_name, start_datetime, end_datetime} = req.body;
  const query = 'INSERT INTO airplane_maintenance (airplane_ID, airline_name, start_datetime, end_datetime) VALUES (?, ?, ?, ?)';
  db.query(query, [airplane_ID, airline_name, start_datetime, end_datetime], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  })
});

/*  View Frequent Customer Last Year
    User passes in airline_name. Returns the customer email, first name, and last name who has purchased the most tickets within the last year.
    JSON:
    {
      airline_name:   string
    }
*/
app.post('/api/staff/view_top_buyer', async (req, res) =>{
  const {airline_name} = req.body;
  const query = "SELECT email, customer.first_name AS first_name, customer.last_name AS last_name, COUNT(ticket_ID) as total_tickets \
  FROM customer JOIN ticket ON customer.email = ticket.payment_email NATURAL JOIN flies\
  WHERE departure_datetime >= CURDATE() - INTERVAL 1 YEAR AND airline_name = ?\
  GROUP BY email ORDER BY total_tickets DESC LIMIT 1";
  db.query(query, [airline_name], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  })
});

/*  View Customer's Flights
    User passes in the airline_name, and the email of a customer. Returns flight data for all flights of that airline the customer has purchased.
    JSON:
    {
      airline_name:   string
      email:          string
    }
*/
app.post('/api/staff/view_customer_flights', async (req, res) =>{
  const {email, airline_name} = req.body;
  const query = "SELECT flight_ID, departure_datetime, arrival_datetime, flight_status, depart_airport_code, arrive_airport_code, B.city AS departure_city, A.city AS arrival_city, airplane_ID, airline_name, num_of_seats\
  FROM flight NATURAL JOIN flight_location JOIN Airport as A ON arrive_airport_code = A.airport_code JOIN Airport as B ON depart_airport_code = B.airport_code NATURAL JOIN flies NATURAL JOIN airplane NATURAL JOIN ticket\
  WHERE ticket.payment_email = ? AND airline_name = ?";
  db.query(query, [email, airline_name], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  })
});

/*  View Earned Revenue
    User passes in the airline_name. Returns a total revenue earned within the last month, and within the last year.
    JSON:
    {
      airline_name:   string
    }
*/
app.post('/api/staff/view_earned_revenue', async (req, res) =>{
  const {airline_name} = req.body;
  const queryMonth = "SELECT sum(ticket_price) AS revenue FROM ticket NATURAL JOIN flight NATURAL JOIN flies WHERE airline_name = ? AND purchases_datetime > CURDATE() - INTERVAL 1 MONTH";
  const queryYear = "SELECT sum(ticket_price) AS revenue FROM ticket NATURAL JOIN flight NATURAL JOIN flies WHERE airline_name = ? AND purchases_datetime > CURDATE() - INTERVAL 1 YEAR";
  const query = util.promisify(db.query).bind(db);

  const results1 = await query(queryMonth, [airline_name]);
  const results2 = await query(queryYear, [airline_name]);

  return res.json({MonthRev: results1[0].revenue, YearRev: results2[0].revenue});
});


// Log server message
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});