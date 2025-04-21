use hms;

CREATE TABLE users(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone_no VARCHAR(15),
    role ENUM('Doctor','Admin','FrontEntry','Nurse')
);

CREATE TABLE doctors (
  d_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  specialization VARCHAR(100),
  degree VARCHAR(100),
  experience INT ,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE patients (
    p_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    bloodGroup ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    phoneno VARCHAR(20) NOT NULL,
    address TEXT ,
    email VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms(
    r_id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('Available','Occupied') DEFAULT 'Available',
);

CREATE TABLE appointments(
     app_id INT AUTO_INCREMENT PRIMARY KEY,
     p_id INT,
     d_id INT,
     a_date DATE,
     priority ENUM('Low','Medium','High'),
     Status Enum('Scheduled','Completed','Cancelled'),
     symptoms TEXT,
     FOREIGN KEY (p_id) REFERENCES patients(p_id),
     FOREIGN KEY (d_id) REFERENCES doctors(d_id)
);

CREATE TABLE admissions (
  adm_id INT AUTO_INCREMENT PRIMARY KEY,
  p_id INT,
  d_id INT,
  r_id INT,
  admit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  discharge_date DATETIME,
  status ENUM('Admitted', 'Discharged') DEFAULT 'NULL',
  FOREIGN KEY (p_id) REFERENCES patients(p_id) ON DELETE CASCADE,
  FOREIGN KEY (d_id) REFERENCES doctors(d_id) ON DELETE SET NULL,
  FOREIGN KEY (r_id) REFERENCES rooms(r_id) ON DELETE SET NULL
);

CREATE TABLE tests (
  t_id INT AUTO_INCREMENT PRIMARY KEY,
  test_name VARCHAR(100)
);

CREATE TABLE conducted(
  c_id INT AUTO_INCREMENT PRIMARY KEY,
  d_id INT,
  p_id INT,
  t_id INT,
  t_date DATE,
  t_result TEXT,
  is_checked BOOLEAN DEFAULT FALSE,
  is_admitted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (d_id) REFERENCES doctors(d_id),
  FOREIGN KEY (p_id) REFERENCES patients(p_id),
  FOREIGN KEY (t_id) REFERENCES tests(t_id)
);

CREATE TABLE treatment (
  treat_id INT AUTO_INCREMENT PRIMARY KEY,
  d_id INT,
  p_id INT,
  prescription TEXT,
  description TEXT,
  treatment_date DATE,
  FOREIGN KEY (d_id) REFERENCES doctors(d_id),
  FOREIGN KEY (p_id) REFERENCES patients(p_id)
);





