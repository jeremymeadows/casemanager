DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS types;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id SERIAL NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(60),
  name VARCHAR(32) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE;
  PRIMARY KEY (user_id)
);

CREATE TABLE sessions (
  session_id UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
  user_id INTEGER NOT NULL,
  expires TIMESTAMP NOT NULL DEFAULT CURRENT_DATE + 90, 
  PRIMARY KEY (session_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE types (
  name VARCHAR(32) NOT NULL,
  subtype VARCHAR(32) NOT NULL,
  PRIMARY KEY (name, subtype)
);

CREATE TABLE cases (
  case_id SERIAL NOT NULL,
  name VARCHAR(32) NOT NULL,
  student_number VARCHAR(6),
  type VARCHAR(32),
  subtype VARCHAR(32),
  assignee INTEGER NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  created DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  PRIMARY KEY (case_id),
  FOREIGN KEY (assignee) REFERENCES users (user_id),
  FOREIGN KEY (type, subtype) REFERENCES types (name, subtype)
);


INSERT INTO users (email, name) VALUES
  ('generalmanager@dkitsu.ie', 'Maria'),
  ('president@dkitsu.ie', 'Niamh'),
  ('engagement@dkitsu.ie', 'Eddie');

INSERT INTO types (name, subtype) VALUES
  ('Accomodation', 'International'),
  ('Accomodation', 'Landlords'),
  ('Education', 'CAs'),
  ('Education', 'Exams'),
  ('Education', 'Repeats'),
  ('Education', 'Academic Integrity'),
  ('Welfare', 'Finance'),
  ('Welfare', 'Sexual Health'),
  ('General', 'Student Leap Card'),
  ('General', 'Other');
