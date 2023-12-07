-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 07, 2023 at 08:56 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `airport`
--

-- --------------------------------------------------------

--
-- Table structure for table `airline`
--

CREATE TABLE `airline` (
  `airline_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `airline`
--

INSERT INTO `airline` (`airline_name`) VALUES
('Jet Blue');

-- --------------------------------------------------------

--
-- Table structure for table `airline_staff`
--

CREATE TABLE `airline_staff` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `airline_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `airline_staff`
--

INSERT INTO `airline_staff` (`username`, `password`, `first_name`, `last_name`, `date_of_birth`, `airline_name`) VALUES
('a@a.com', '$2b$10$C.RxFsyw27os8BJlU2VmyuywxEsQmRghbgnwmhwXjMkzafAD29GGK', 'a', 'b', NULL, 'Jet Blue'),
('worker1', 'password1', 'Joe', 'Mahmuh', '1950-01-01', 'Jet Blue');

-- --------------------------------------------------------

--
-- Table structure for table `airplane`
--

CREATE TABLE `airplane` (
  `airplane_ID` int(11) NOT NULL,
  `num_of_seats` int(11) DEFAULT NULL,
  `manufacturing_company` varchar(255) DEFAULT NULL,
  `model_number` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `airline_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `airplane`
--

INSERT INTO `airplane` (`airplane_ID`, `num_of_seats`, `manufacturing_company`, `model_number`, `age`, `airline_name`) VALUES
(1, 80, 'Boeing', 'ABCD1234', 73, 'Jet Blue'),
(2, 80, 'Jet Blue', 'ABCD1234', 73, 'Jet Blue'),
(3, 80, 'Airbus', 'ABCD1234', 73, 'Jet Blue'),
(4, 6, 'X company', '12345678', 72, 'Jet Blue');

-- --------------------------------------------------------

--
-- Table structure for table `airplane_maintenance`
--

CREATE TABLE `airplane_maintenance` (
  `airplane_ID` int(11) NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `airline_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `airplane_maintenance`
--

INSERT INTO `airplane_maintenance` (`airplane_ID`, `start_datetime`, `end_datetime`, `airline_name`) VALUES
(2, '2023-12-28 12:47:00', '2023-12-30 12:47:00', 'Jet Blue');

-- --------------------------------------------------------

--
-- Table structure for table `airport`
--

CREATE TABLE `airport` (
  `airport_code` varchar(3) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `num_of_terminals` int(11) DEFAULT NULL,
  `airport_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `airport`
--

INSERT INTO `airport` (`airport_code`, `name`, `city`, `country`, `num_of_terminals`, `airport_type`) VALUES
('JFK', NULL, 'New York', NULL, NULL, NULL),
('ORD', 'O\'Hare International Airport', 'Chicago', 'USA', 7, 'International'),
('PVG', NULL, 'Shanghai', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `email` varchar(255) NOT NULL,
  `flight_ID` int(11) NOT NULL,
  `departure_datetime` datetime NOT NULL,
  `comment` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`email`, `flight_ID`, `departure_datetime`, `comment`) VALUES
('a@c.com', 120, '2022-12-25 01:00:00', 'cool');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `building` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `apartment` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zipcode` varchar(255) DEFAULT NULL,
  `card_type` varchar(255) DEFAULT NULL,
  `card_number` bigint(20) DEFAULT NULL,
  `name_on_card` varchar(255) DEFAULT NULL,
  `card_exp_date` date DEFAULT NULL,
  `passport_num` varchar(255) DEFAULT NULL,
  `passport_expr` date DEFAULT NULL,
  `passport_country` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`email`, `password`, `first_name`, `last_name`, `building`, `street`, `apartment`, `city`, `state`, `zipcode`, `card_type`, `card_number`, `name_on_card`, `card_exp_date`, `passport_num`, `passport_expr`, `passport_country`, `date_of_birth`) VALUES
('a@c.com', '$2b$10$qKG7zS7eJ2V8cpD2Pk4MVu1yK537dXF0256D37I1o6VA7r2MEvBLq', 'a', 'b', 'building', 'street', 'apt', 'city', 'state', 'zip', 'debit', 12345678, 'a', '2025-12-05', 'A12345678', '2032-12-17', 'country', '2013-12-08'),
('b@c.com', '$2b$10$xUKBabe05oX3jqHLYK7sd.KKXTaLhuEpvJNZGEvRAA9Wwj4MmGrhS', '', '', '', '', '', '', '', '', 'debit', 0, '', '0000-00-00', '', '0000-00-00', '', '0000-00-00'),
('c@c.com', '$2b$10$vvvBASXyY35KdmetD8T/cOuCI4DOrl081BwvhD0rKQkL/JgxPILkC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer_phone`
--

CREATE TABLE `customer_phone` (
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_phone`
--

INSERT INTO `customer_phone` (`email`, `phone_number`) VALUES
('a@c.com', '15555555555');

-- --------------------------------------------------------

--
-- Table structure for table `flies`
--

CREATE TABLE `flies` (
  `airplane_ID` int(11) NOT NULL,
  `flight_ID` int(11) NOT NULL,
  `airline_name` varchar(255) NOT NULL,
  `departure_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flies`
--

INSERT INTO `flies` (`airplane_ID`, `flight_ID`, `airline_name`, `departure_datetime`) VALUES
(1, 123, 'Jet Blue', '2023-12-24 01:55:00'),
(1, 150, 'Jet Blue', '2023-12-06 17:03:00'),
(2, 124, 'Jet Blue', '2023-12-25 01:55:00'),
(3, 120, 'Jet Blue', '2022-12-25 01:00:00'),
(4, 155, 'Jet Blue', '2023-12-27 14:11:00'),
(4, 175, 'Jet Blue', '2023-08-08 14:53:00');

-- --------------------------------------------------------

--
-- Table structure for table `flight`
--

CREATE TABLE `flight` (
  `flight_ID` int(11) NOT NULL,
  `departure_datetime` datetime NOT NULL,
  `arrival_datetime` datetime DEFAULT NULL,
  `base_price` float(20,2) DEFAULT NULL,
  `flight_status` varchar(255) DEFAULT NULL,
  `remaining_seats` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flight`
--

INSERT INTO `flight` (`flight_ID`, `departure_datetime`, `arrival_datetime`, `base_price`, `flight_status`, `remaining_seats`) VALUES
(120, '2022-12-25 01:00:00', '2022-12-26 02:00:00', 40.00, 'on_time', 79),
(123, '2023-12-24 01:55:00', '2023-12-24 21:33:00', 1000.00, 'delayed', 78),
(124, '2023-12-25 01:55:00', '2023-12-25 21:33:00', 500.00, 'on time', 79),
(150, '2023-12-06 17:03:00', '2023-12-07 17:03:00', 400.00, 'delayed', 80),
(155, '2023-12-27 14:11:00', '2023-12-28 14:11:00', 20.00, 'on-time', 6),
(175, '2023-08-08 14:53:00', '2023-08-09 14:53:00', 50.00, 'on-time', 6);

-- --------------------------------------------------------

--
-- Table structure for table `flight_location`
--

CREATE TABLE `flight_location` (
  `flight_ID` int(11) NOT NULL,
  `departure_datetime` datetime NOT NULL,
  `depart_airport_code` varchar(3) NOT NULL,
  `arrive_airport_code` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flight_location`
--

INSERT INTO `flight_location` (`flight_ID`, `departure_datetime`, `depart_airport_code`, `arrive_airport_code`) VALUES
(120, '2022-12-25 01:00:00', 'JFK', 'PVG'),
(123, '2023-12-24 01:55:00', 'JFK', 'PVG'),
(124, '2023-12-25 01:55:00', 'PVG', 'JFK'),
(150, '2023-12-06 17:03:00', 'PVG', 'JFK'),
(155, '2023-12-27 14:11:00', 'PVG', 'JFK'),
(175, '2023-08-08 14:53:00', 'PVG', 'JFK');

-- --------------------------------------------------------

--
-- Table structure for table `rating`
--

CREATE TABLE `rating` (
  `email` varchar(255) NOT NULL,
  `flight_ID` int(11) NOT NULL,
  `departure_datetime` datetime NOT NULL,
  `rating` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rating`
--

INSERT INTO `rating` (`email`, `flight_ID`, `departure_datetime`, `rating`) VALUES
('a@c.com', 120, '2022-12-25 01:00:00', 3),
('b@c.com', 120, '2022-12-25 01:00:00', 5);

-- --------------------------------------------------------

--
-- Table structure for table `staff_email`
--

CREATE TABLE `staff_email` (
  `username` varchar(255) NOT NULL,
  `airline_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_email`
--

INSERT INTO `staff_email` (`username`, `airline_name`, `email`) VALUES
('a@a.com', 'Jet Blue', 'b@a.com');

-- --------------------------------------------------------

--
-- Table structure for table `staff_phone`
--

CREATE TABLE `staff_phone` (
  `username` varchar(255) NOT NULL,
  `airline_name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_phone`
--

INSERT INTO `staff_phone` (`username`, `airline_name`, `phone_number`) VALUES
('a@a.com', 'Jet Blue', '15555');

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `ticket_ID` int(11) NOT NULL,
  `flight_ID` int(11) DEFAULT NULL,
  `departure_datetime` datetime DEFAULT NULL,
  `ticket_price` float(20,2) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `payment_email` varchar(255) DEFAULT NULL,
  `purchases_datetime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket`
--

INSERT INTO `ticket` (`ticket_ID`, `flight_ID`, `departure_datetime`, `ticket_price`, `first_name`, `last_name`, `date_of_birth`, `payment_email`, `purchases_datetime`) VALUES
(224, 123, '2023-12-24 01:55:00', 1000.00, 'a', 'b', '2008-02-21', 'a@c.com', '2023-12-07 04:14:19'),
(225, 124, '2023-12-25 01:55:00', 500.00, 'a', 'b', '2024-02-24', 'a@c.com', '2023-12-07 04:29:30'),
(226, 123, '2023-12-24 01:55:00', 1000.00, 'b', 'c', '2024-01-13', 'b@c.com', '2023-12-07 04:31:00'),
(228, 120, '2022-12-25 01:00:00', 1000.00, 'a', 'c', '2002-02-16', 'a@c.com', '2022-06-25 00:00:00'),
(230, 123, '2023-12-24 01:55:00', 1250.00, 'Bob', 'joe', '1999-01-01', 'a@c.com', '2023-11-05 00:00:00'),
(231, 123, '2023-12-24 01:55:00', 700.00, 'Bob', 'joe', '1999-01-01', 'a@c.com', '2023-10-05 00:00:00'),
(235, 120, '2022-12-25 01:00:00', 1000.00, 'Joe', 'Bob', '1999-01-01', 'b@c.com', '2022-10-05 00:00:00'),
(236, 175, '2023-08-08 14:53:00', 50.00, 'Bob', 'Joe', '1999-01-01', 'a@c.com', '2023-06-05 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `airline`
--
ALTER TABLE `airline`
  ADD PRIMARY KEY (`airline_name`);

--
-- Indexes for table `airline_staff`
--
ALTER TABLE `airline_staff`
  ADD PRIMARY KEY (`username`,`airline_name`),
  ADD KEY `airline_name` (`airline_name`);

--
-- Indexes for table `airplane`
--
ALTER TABLE `airplane`
  ADD PRIMARY KEY (`airplane_ID`,`airline_name`),
  ADD KEY `airline_name` (`airline_name`);

--
-- Indexes for table `airplane_maintenance`
--
ALTER TABLE `airplane_maintenance`
  ADD PRIMARY KEY (`airplane_ID`,`start_datetime`,`end_datetime`),
  ADD KEY `airplane_ID` (`airplane_ID`,`airline_name`);

--
-- Indexes for table `airport`
--
ALTER TABLE `airport`
  ADD PRIMARY KEY (`airport_code`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`email`,`flight_ID`,`departure_datetime`),
  ADD KEY `flight_ID` (`flight_ID`,`departure_datetime`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `customer_phone`
--
ALTER TABLE `customer_phone`
  ADD PRIMARY KEY (`email`,`phone_number`);

--
-- Indexes for table `flies`
--
ALTER TABLE `flies`
  ADD PRIMARY KEY (`airplane_ID`,`airline_name`,`flight_ID`,`departure_datetime`),
  ADD KEY `flight_ID` (`flight_ID`,`departure_datetime`);

--
-- Indexes for table `flight`
--
ALTER TABLE `flight`
  ADD PRIMARY KEY (`flight_ID`,`departure_datetime`);

--
-- Indexes for table `flight_location`
--
ALTER TABLE `flight_location`
  ADD PRIMARY KEY (`flight_ID`,`departure_datetime`,`depart_airport_code`,`arrive_airport_code`),
  ADD KEY `depart_airport_code` (`depart_airport_code`),
  ADD KEY `arrive_airport_code` (`arrive_airport_code`);

--
-- Indexes for table `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`email`,`flight_ID`,`departure_datetime`),
  ADD KEY `flight_ID` (`flight_ID`,`departure_datetime`);

--
-- Indexes for table `staff_email`
--
ALTER TABLE `staff_email`
  ADD PRIMARY KEY (`username`,`email`,`airline_name`),
  ADD KEY `username` (`username`,`airline_name`);

--
-- Indexes for table `staff_phone`
--
ALTER TABLE `staff_phone`
  ADD PRIMARY KEY (`username`,`phone_number`,`airline_name`),
  ADD KEY `username` (`username`,`airline_name`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`ticket_ID`),
  ADD KEY `payment_email` (`payment_email`),
  ADD KEY `flight_ID` (`flight_ID`,`departure_datetime`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `airplane`
--
ALTER TABLE `airplane`
  MODIFY `airplane_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `flight`
--
ALTER TABLE `flight`
  MODIFY `flight_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=176;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `ticket_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=237;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `airline_staff`
--
ALTER TABLE `airline_staff`
  ADD CONSTRAINT `airline_staff_ibfk_1` FOREIGN KEY (`airline_name`) REFERENCES `airline` (`airline_name`);

--
-- Constraints for table `airplane`
--
ALTER TABLE `airplane`
  ADD CONSTRAINT `airplane_ibfk_1` FOREIGN KEY (`airline_name`) REFERENCES `airline` (`airline_name`);

--
-- Constraints for table `airplane_maintenance`
--
ALTER TABLE `airplane_maintenance`
  ADD CONSTRAINT `airplane_maintenance_ibfk_1` FOREIGN KEY (`airplane_ID`,`airline_name`) REFERENCES `airplane` (`airplane_ID`, `airline_name`);

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`email`) REFERENCES `customer` (`email`),
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`flight_ID`,`departure_datetime`) REFERENCES `flight` (`flight_ID`, `departure_datetime`);

--
-- Constraints for table `flies`
--
ALTER TABLE `flies`
  ADD CONSTRAINT `flies_ibfk_2` FOREIGN KEY (`flight_ID`,`departure_datetime`) REFERENCES `flight` (`flight_ID`, `departure_datetime`),
  ADD CONSTRAINT `flies_ibfk_3` FOREIGN KEY (`airplane_ID`,`airline_name`) REFERENCES `airplane` (`airplane_ID`, `airline_name`);

--
-- Constraints for table `flight_location`
--
ALTER TABLE `flight_location`
  ADD CONSTRAINT `flight_location_ibfk_2` FOREIGN KEY (`depart_airport_code`) REFERENCES `airport` (`airport_code`),
  ADD CONSTRAINT `flight_location_ibfk_3` FOREIGN KEY (`arrive_airport_code`) REFERENCES `airport` (`airport_code`),
  ADD CONSTRAINT `flight_location_ibfk_4` FOREIGN KEY (`flight_ID`,`departure_datetime`) REFERENCES `flight` (`flight_ID`, `departure_datetime`);

--
-- Constraints for table `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`email`) REFERENCES `customer` (`email`),
  ADD CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`flight_ID`,`departure_datetime`) REFERENCES `flight` (`flight_ID`, `departure_datetime`);

--
-- Constraints for table `staff_email`
--
ALTER TABLE `staff_email`
  ADD CONSTRAINT `staff_email_ibfk_1` FOREIGN KEY (`username`,`airline_name`) REFERENCES `airline_staff` (`username`, `airline_name`);

--
-- Constraints for table `staff_phone`
--
ALTER TABLE `staff_phone`
  ADD CONSTRAINT `staff_phone_ibfk_1` FOREIGN KEY (`username`,`airline_name`) REFERENCES `airline_staff` (`username`, `airline_name`);

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`payment_email`) REFERENCES `customer` (`email`),
  ADD CONSTRAINT `ticket_ibfk_3` FOREIGN KEY (`flight_ID`,`departure_datetime`) REFERENCES `flight` (`flight_ID`, `departure_datetime`),
  ADD CONSTRAINT `ticket_ibfk_4` FOREIGN KEY (`flight_ID`,`departure_datetime`) REFERENCES `flight` (`flight_ID`, `departure_datetime`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
