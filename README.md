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

## Project Showcase
### Staff/Customer Login/Sign up
![image](https://github.com/Frankbz/Skyhub/assets/98783358/98e196e0-3a53-4662-80d4-63969cb4f6cb)

### Customer Homepage
![image](https://github.com/Frankbz/Skyhub/assets/98783358/0dff96c1-3c50-4930-a4f4-c9ba5813a4fd)

### Customer Profile Page
![image](https://github.com/Frankbz/Skyhub/assets/98783358/e98200c0-6e7b-4790-800d-8c7042f547be)

### Customer Track Spending
![image](https://github.com/Frankbz/Skyhub/assets/98783358/5766ea18-bfe9-453b-b21b-2ed870e6522a)

### Staff Homepags
![image](https://github.com/Frankbz/Skyhub/assets/98783358/3a8b1cdb-6c93-4eb7-8643-8518678aa02a)

### Staff Management Page
![image](https://github.com/Frankbz/Skyhub/assets/98783358/9e7c01bd-9a91-4a75-a4f1-4ca4027537d6)



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
  
     
