-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 21, 2024 at 12:22 PM
-- Server version: 8.4.3
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `afterdelete`
--

CREATE TABLE `afterdelete` (
  `ProductID` int DEFAULT NULL,
  `Category` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Make` varchar(255) DEFAULT NULL,
  `Model` varchar(255) DEFAULT NULL,
  `ProductSerial` varchar(255) DEFAULT NULL,
  `Project` varchar(255) DEFAULT NULL,
  `Owner` varchar(255) DEFAULT NULL,
  `Condition` varchar(255) DEFAULT NULL,
  `Handover_Date` varchar(255) DEFAULT NULL,
  `empname` varchar(255) DEFAULT NULL,
  `Delete_Date` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `afterdelete`
--

INSERT INTO `afterdelete` (`ProductID`, `Category`, `Name`, `Make`, `Model`, `ProductSerial`, `Project`, `Owner`, `Condition`, `Handover_Date`, `empname`, `Delete_Date`) VALUES
(730, 'UAV', 'UAV BATTERY', 'IDEAFORGE', 'RYNO', NULL, 'NOIDA OFFICE', 'A00019', NULL, NULL, NULL, '2024-10-17 10:27:20'),
(727, 'UAV', 'UAV BATTERY', 'DJI', 'MAVIC 3', '4ERKL4G6G32405', 'ROCKFALL MITIGATION', 'C00105', 'Good', '-', 'DEBABRATA GIRI', '2024-10-17 10:32:19'),
(735, 'UAV', 'X8 CHARGER', 'IDEAFORGE', 'RYNO', 'PP421234', 'NOIDA OFFICE', 'A00019', 'Good', '-', 'GAURAV GAUTAM', '2024-10-17 10:32:32'),
(5, 'DGPS', 'TRIBRACH', 'TRIMBLE', '58002007', 'T-20-18862', 'EDALL (RS)', 'V00004', 'Good', '2024-10-17', 'Vivek Kumar', '2024-10-22 16:41:37');


-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'DGPS'),
(2, 'UAV'),
(3, 'Office');

-- --------------------------------------------------------

--
-- Table structure for table `deleted_inventory`
--

CREATE TABLE `deleted_inventory` (
  `ProductID` varchar(255) NOT NULL,
  `Category` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Make` varchar(255) DEFAULT NULL,
  `Model` varchar(255) DEFAULT NULL,
  `Owner` varchar(255) DEFAULT NULL,
  `Project` varchar(255) DEFAULT NULL,
  `Delete_Date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `handover_data`
--

CREATE TABLE `handover_data` (
  `FormID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `EwayBillNo` varchar(255) DEFAULT NULL,
  `Category` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Make` varchar(255) DEFAULT NULL,
  `Model` varchar(255) DEFAULT NULL,
  `ProductID` varchar(255) DEFAULT NULL,
  `Source` varchar(255) DEFAULT NULL,
  `Destination` varchar(255) DEFAULT NULL,
  `Sender` varchar(255) DEFAULT NULL,
  `Receiver` varchar(255) DEFAULT NULL,
  `SenderCondition` varchar(255) DEFAULT NULL,
  `SenderRemarks` varchar(255) DEFAULT NULL,
  `ReceiverCondition` varchar(255) DEFAULT NULL,
  `ReceiverRemark` varchar(255) DEFAULT NULL,
  `ApprovalToSend` varchar(255) DEFAULT NULL,
  `ApprovalToReceive` varchar(255) DEFAULT NULL,
  `InitiationDate` varchar(255) DEFAULT NULL,
  `CompletionDate` varchar(255) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `Sendername` varchar(255) DEFAULT NULL,
  `Receivername` varchar(255) DEFAULT NULL,
  `ewayreason` varchar(255) DEFAULT NULL,
  `DisapproveRemarks` varchar(255) DEFAULT NULL,
  `ProductSerial` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `handover_data`
--

INSERT INTO `handover_data` (`FormID`, `EwayBillNo`, `Category`, `Name`, `Make`, `Model`, `ProductID`, `Source`, `Destination`, `Sender`, `Receiver`, `SenderCondition`, `SenderRemarks`, `ReceiverCondition`, `ReceiverRemark`, `ApprovalToSend`, `ApprovalToReceive`, `InitiationDate`, `CompletionDate`, `Status`, `Sendername`, `Receivername`, `ewayreason`, `DisapproveRemarks`, `ProductSerial`) VALUES
('3b2c14ad', '161952495172', 'DGPS', 'DGPS RECEIVER', 'TRIMBLE', 'R12', '176', 'SSLR KARNATAKA', 'BMC', 'C00131', 'P00161', 'Good', '', 'Good', '', '1', '1', '2024-11-23 12:32:34', '2024-11-23 12:36:48', 'Approved', 'Ritik Kumar yadav', 'Pradeep Kumar Pal', '-', '-', '6309F00394'),
('3b2c14ad', '161952495172', 'DGPS', 'DGPS CONTROLLER', 'TRIMBLE', 'TSC5', '177', 'SSLR KARNATAKA', 'BMC', 'C00131', 'P00161', 'Good', '', 'Good', '', '1', '1', '2024-11-23 12:32:34', '2024-11-23 12:36:48', 'Approved', 'Ritik Kumar yadav', 'Pradeep Kumar Pal', '-', '-', 'JAJ223110070'),
('a3b4d1c2', '123456788911', 'DGPS', 'DGPS RECEIVER BAG', 'TRIMBLE', 'DA2', '51', 'MUMBAIHQ', 'SOI ASSAM', 'P00122', 'C00073', 'Good', '', 'Good', '', '1', '1', '2024-11-25 15:40:05', '2024-11-25 15:42:19', 'Approved', 'Sarvesh Kumar Maurya', 'Ajay Maurya', '-', '-', 'DA20568-RB'),
('a3b4d1c2', '123456788911', 'DGPS', 'DGPS CONTROLLER', 'SAMSUNG', 'SAMSUNG GALAXY A23 (DA2)', '155', 'MUMBAIHQ', 'SOI ASSAM', 'P00122', 'C00073', 'Good', '', 'Good', '', '1', '1', '2024-11-25 15:40:05', '2024-11-25 15:42:19', 'Approved', 'Sarvesh Kumar Maurya', 'Ajay Maurya', '-', '-', 'RZ8W201JNDV'),
('a3b4d1c2', '123456788911', 'DGPS', 'DGPS CONTROLLER CHARGER', 'SAMSUNG', 'SAMSUNG GALAXY A23 (DA2)', '156', 'MUMBAIHQ', 'SOI ASSAM', 'P00122', 'C00073', 'Good', '', 'Good', '', '1', '1', '2024-11-25 15:40:05', '2024-11-25 15:42:19', 'Approved', 'Sarvesh Kumar Maurya', 'Ajay Maurya', '-', '-', 'R37H73J14G1SE3'),
('a3b4d1c2', '123456788911', 'DGPS', 'DGPS BATTERY', 'ANKER', 'DA2-A1109', '157', 'MUMBAIHQ', 'SOI ASSAM', 'P00122', 'C00073', 'Good', '', 'Good', '', '1', '1', '2024-11-25 15:40:05', '2024-11-25 15:42:19', 'Approved', 'Sarvesh Kumar Maurya', 'Ajay Maurya', '-', '-', 'AACJQ91C36500482'),
('4c3dab12', '123456722212', 'DGPS', 'DGPS RECEIVER', 'TRIMBLE', 'DA2', '786', 'BMC', 'SOI ASSAM', 'P00122', 'C00073', 'Good', '', 'Good', '', '1', '1', '2024-11-29 17:48:38', '2024-11-29 17:50:49', 'Approved', 'Sarvesh Kumar Maurya', 'Ajay Maurya', '-', '-', '6306100528');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `ProductID` int NOT NULL,
  `Category` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Make` varchar(255) DEFAULT NULL,
  `Model` varchar(255) DEFAULT NULL,
  `ProductSerial` varchar(255) DEFAULT NULL,
  `Project` varchar(255) DEFAULT NULL,
  `Owner` varchar(255) DEFAULT NULL,
  `Condition` varchar(255) DEFAULT NULL,
  `Handover_Date` varchar(255) DEFAULT NULL,
  `empname` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`ProductID`, `Category`, `Name`, `Make`, `Model`, `ProductSerial`, `Project`, `Owner`, `Condition`, `Handover_Date`, `empname`) VALUES
(2, 'DGPS', 'DGPS RECEIVER', 'TRIMBLE', 'R6', 'R6RV2013A', 'SOI HP', 'V00004', 'Good', '2024-12-16', 'Vivek Kumar'),
(3, 'DGPS', 'DGPS BATTERY', 'TRIMBLE', 'R6', 'MA1323A', 'SOI HP', 'V00004', 'Good', '2024-12-16', 'Vivek Kumar'),
(5, 'DGPS', 'TRIBRACH', 'TRIMBLE', '58002007', 'T-20-18862', 'SOI HP', 'V00004', 'Good', '2024-12-12', 'Vivek Kumar'),
(6, 'DGPS', 'DGPS CONTOLLER BAG', 'TRIMBLE', 'R6', 'R6RV2013A', 'SOI TRIPURA', 'V00004', 'Good', '-', 'Vivek Kumar');

-- --------------------------------------------------------

--
-- Table structure for table `managers_data`
--

CREATE TABLE `managers_data` (
  `Name` varchar(255) DEFAULT NULL,
  `ID` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `TypeOfAccount` varchar(255) DEFAULT NULL,
  `MailID` varchar(255) DEFAULT NULL,
  `PhoneNo` varchar(255) DEFAULT NULL,
  `manager_index_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `managers_data`
--

INSERT INTO `managers_data` (`Name`, `ID`, `Password`, `TypeOfAccount`, `MailID`, `PhoneNo`, `manager_index_id`) VALUES


-- --------------------------------------------------------

--
-- Table structure for table `projects_managers`
--

CREATE TABLE `projects_managers` (
  `Projects` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `GSTIN` varchar(255) DEFAULT NULL,
  `STATE` varchar(255) DEFAULT NULL,
  `State_Code` varchar(255) DEFAULT NULL,
  `Manager` varchar(255) DEFAULT NULL,
  `project_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `projects_managers`
--

INSERT INTO `projects_managers` (`Projects`, `Address`, `GSTIN`, `STATE`, `State_Code`, `Manager`, `project_id`) VALUES
('SOI JAMMU AND KASHMIR', 'WARD NO 1, JANIPUR, KATRA, Reasi, Jammu and Kashmir,180007', '01AAHCP3734A1Z3', 'Jammu and Kashmir', '1', 'Kalsekar Tabish', 3),
('NOIDA OFFICE', 'Office no. 909,  Tower – A,  9th Floor, I-Thum, Plot No. A- 40, Block A, Industrial Area, Sector 62, Noida, Gautam  Buddha Nagar, Uttar Pradesh - 201309', '09AAHCP3734A1ZN', 'Uttar Pradesh', '9', 'Rahul Ranjan', 4),
('SOI GUJARAT', '402, Abhiraj, 68/B, Swastik Society, CG Road, Navrangpura,Ahmedabad, Gujarat - 380009.', '24AAHCP3734A1ZV', 'Gujarat', '24', 'Prashant Lingayat', 5),
('SSLR KARNATAKA', '154/20, Royal Space, 3rd Floor, 5th Main Road, HSR Layout, Bengaluru, Karnataka - 560068.', '29AAHCP3734A1ZL', 'Karnataka', '29', 'Shrikanth G Kotian', 6),
('SOI KARNATAKA', '154/20, Royal Space, 3rd Floor, 5th Main Road, HSR Layout, Bengaluru, Karnataka - 560068.', '29AAHCP3734A1ZL', 'Karnataka', '29', 'Shrikanth G Kotian', 7),
('CD SPACE (RS)', '154/20, Royal Space, 3rd Floor, 5th Main Road, HSR Layout, Bengaluru, Karnataka - 560068.', '29AAHCP3734A1ZL', 'Karnataka', '29', 'Kalsekar Tabish', 8),
('EDALL (RS)', '154/20, Royal Space, 3rd Floor, 5th Main Road, HSR Layout, Bengaluru, Karnataka - 560068.', '29AAHCP3734A1ZL', 'Karnataka', '29', 'Kalsekar Tabish', 9),
('ALLTERRA (RS)', '5TH FLOOR, B2 509, Boomerang Co-Op Premises Society Limited,\nChandivali Farm Road, Chandivali, Mumbai, Mumbai Suburban,\nMaharashtra, 400072', '27AAHCP3734A1ZP', 'Maharashtra', '27', 'Kalsekar Tabish', 10),
('IDEAFORGE (RS)', '5TH FLOOR, B2 509, Boomerang Co-Op Premises Society Limited,\nChandivali Farm Road, Chandivali, Mumbai, Mumbai Suburban,\nMaharashtra, 400072', '27AAHCP3734A1ZP', 'Maharashtra', '27', 'Kalsekar Tabish', 11),
('CARBON BLACK COMPOSITES (RS)', '5TH FLOOR, B2 509, Boomerang Co-Op Premises Society Limited,\nChandivali Farm Road, Chandivali, Mumbai, Mumbai Suburban,\nMaharashtra, 400072', '27AAHCP3734A1ZP', 'Maharashtra', '27', 'Kalsekar Tabish', 12),
('ROCKFALL MITIGATION', '5TH FLOOR, B2 509, Boomerang Co-Op Premises Society Limited,\nChandivali Farm Road, Chandivali, Mumbai, Mumbai Suburban,\nMaharashtra, 400072', '27AAHCP3734A1ZP', 'Maharashtra', '27', 'Wasim Kazi', 13),
('VANDRI CANAL PROJECT', '5TH FLOOR, B2 509, Boomerang Co-Op Premises Society Limited,Chandivali Farm Road, Chandivali, Mumbai, Mumbai Suburban,Maharashtra, 400072', '27AAHCP3734A1ZP', 'Maharashtra', '27', 'Prashant Lingayat', 14),
('MUMBAIHQ', '5TH FLOOR, B2 509, Boomerang Co-Op Premises Society Limited,Chandivali Farm Road, Chandivali, Mumbai, Mumbai Suburban,Maharashtra, 400072', '27AAHCP3734A1ZP', 'Maharashtra', '27', 'Prashant Lingayat', 15),
('SRA', '5TH FLOOR, B2 509, Boomerang Co-Op Premises Society Limited,Chandivali Farm Road, Chandivali, Mumbai, Mumbai Suburban,Maharashtra, 400072', '27AAHCP3734A1ZP', 'Maharashtra', '27', 'Prashant Lingayat', 16),
('INDRONES (RS)', '5TH FLOOR, B2 509, Boomerang Co-Op Premises Society Limited,\nChandivali Farm Road, Chandivali, Mumbai, Mumbai Suburban,\nMaharashtra, 400072', '27AAHCP3734A1ZP', 'Maharashtra', '27', 'Kalsekar Tabish', 17),
('SOI PUNJAB', 'SCO NO 105, Preet City, Sector 86, Mohali, SAS Nagar, Punjab - 140308', '03AAHCP3734A1ZZ', 'Punjab', '3', 'Rahul Ranjan', 18),
('SOI KERALA', '-', '-', '-', '-', 'Shrikanth G Kotian', 19),
('SOI TRIPURA', '-', '-', '-', '-', 'Shrikanth G Kotian', 20),
('BMC', '5TH FLOOR, B2 509, Boomerang Co-Op Premises Society Limited, Chandivali Farm Road, Chandivali, Mumbai, Mumbai Suburban, Maharashtra, 400072', '27AAHCP3734A1ZP', 'MAHARASHTRA', '27', 'Prashant Lingayat', 26),
('SOI ARUNACHAL', '103 AND 105, , khalaktang, WEST KAMENG, West Kameng, Arunachal Pradesh, 790002', '12AAHCP3734A1Z0', 'Arunachal Pradesh', '12', 'Rahul Ranjan', 28),
('SOI ASSAM', '103 AND 105, , khalaktang, WEST KAMENG, West Kameng, Arunachal Pradesh, 790002', '12AAHCP3734A1Z0', 'Arunachal Pradesh', '12', 'Rahul Ranjan', 29),
('SOI HIMACHAL PRADESH', 'VILLAGE SOLANG, SNOW NEST PAYING GUEST HOUSE, POST OFFICE PALCHAN, TEHSIL MANALI, MANALI, Kullu, Himachal Pradesh, 175103', '02AAHCP3734A1Z1', 'Himachal Pradesh', '02', 'Rahul Ranjan', 34),
('SOI HP', 'VILLAGE SOLANG, SNOW NEST PAYING GUEST HOUSE, POST OFFICE PALCHAN, TEHSIL MANALI, MANALI, Kullu, Himachal Pradesh, 175103', '02AAHCP3734A1Z1', 'Himachal Pradesh', '02', 'Rahul Ranjan', 35),
('SOI UP', 'Office no. 909,  Tower – A,  9th Floor, I-Thum, Plot No. A- 40, Block A, Industrial Area, Sector 62, Noida, Gautam  Buddha Nagar, Uttar Pradesh - 201309', '09AAHCP3734A1ZN', 'Uttar Pradesh', '09', 'Rahul Ranjan', 36);

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `Name` varchar(255) DEFAULT NULL,
  `ID` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `TypeOfAccount` varchar(255) DEFAULT NULL,
  `Project` varchar(255) DEFAULT NULL,
  `MailID` varchar(255) DEFAULT NULL,
  `PhoneNo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`Name`, `ID`, `Password`, `TypeOfAccount`, `Project`, `MailID`, `PhoneNo`) VALUES


--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `deleted_inventory`
--
ALTER TABLE `deleted_inventory`
  ADD PRIMARY KEY (`ProductID`,`Delete_Date`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`ProductID`);

--
-- Indexes for table `managers_data`
--
ALTER TABLE `managers_data`
  ADD PRIMARY KEY (`manager_index_id`);

--
-- Indexes for table `projects_managers`
--
ALTER TABLE `projects_managers`
  ADD PRIMARY KEY (`project_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `managers_data`
--
ALTER TABLE `managers_data`
  MODIFY `manager_index_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `projects_managers`
--
ALTER TABLE `projects_managers`
  MODIFY `project_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
