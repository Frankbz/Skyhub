# Skyhub

## Project Description
This is a class project for CS-UY 3083. This full-stack website is used for flight reservation and management. It supports the following features:
1. Customer
  - Sign up and log in to the system
  - Search for future flights based on source city/airport name, destination city/airport name and departure date specified
  - Check flights' status
  - Add multiple phone numbers
  - Buy tickets
  - Cancel tickets and get refunded 24 hours before the flight
  - Rate and comment on past flights
  - Track monthly spending on a bar chart based on the time range specified
2. Airline Staff
  - Sign up and log in to the airline he/she works for
  - Search for all flights of the airline based on source city/airport name, destination city/airport name and departure date specified
  - Update flight status
  - Add multiple phone numbers and emails
  - Create new flights
  - Add new airports
  - Add new airplanes
  - Schedule maintenance for a certain airplane
  - View all customers of a flight
  - View all ratings and comments of a flight
  - View all flights for a customer
  - View the most frequent customer of the airline
  - View the revenue of last month and last year of the airline

## Tech Stack
* Frontend: React.js
* Backend: Node.js
* Database: MySQL
* Authentication: Json Web Token

## Set Up
Make sure you have node installed on your device
1. Go to server folder
   * Make sure MySQL server is open at port 3306
   * Make sure your port 4000 is avaliabale or you can change port at /.env 
   * run `npm install` to install all packages and dependencies on backend
   * run `node server.js`
2. (In another terminal) Go to client folder
   * run `npm install` to install all packages and dependencies on frontend
   * run `npm start`
  
## Contributions
1. Frank Zhao (bz2190@nyu.edu)
   * Frontend design and development
   * Backend setup and authentication
2. Jonathan Guan (jg6496@nyu.edu)
   * Backend API routes
   * Database management
  
     
