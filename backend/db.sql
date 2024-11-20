-- Create the database
CREATE DATABASE sms_db;
USE sms_db;

-- Create the users table
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(255) NOT NULL,
  user_type ENUM('student', 'lecturer') NOT NULL
);

-- Create the students table
CREATE TABLE students (
  user_id INT PRIMARY KEY,
  cpm_no VARCHAR(255) NOT NULL,
  registration_no VARCHAR(255) NOT NULL,
  cgpa DECIMAL(3, 2) NOT NULL,
  extra_curricular TEXT,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create the lecturers table
CREATE TABLE lecturers (
  user_id INT PRIMARY KEY,
  position VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  hod BOOLEAN DEFAULT FALSE,
  department VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- Create the news table
CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create the letter table
CREATE TABLE letter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  purpose VARCHAR(255) NOT NULL,
  to VARCHAR(255) NOT NULL,
  request_date DATETIME NOT NULL,
  submitted_date DATETIME,
  status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  content TEXT NOT NULL,
  signature VARCHAR(255), -- URL to the signature image
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
