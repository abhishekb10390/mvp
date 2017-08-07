CREATE TABLE books (
  id integer PRIMARY KEY AUTO_INCREMENT,
  booktitle text,
  authorid integer NOT NULL, 
  roomid integer NOT NULL, 
  FOREIGN KEY (authorid) REFERENCES authors(id),  
  FOREIGN KEY (roomid) REFERENCES rooms(id)  
);

CREATE TABLE authors (
  id integer PRIMARY KEY AUTO_INCREMENT, 
  author text 
);

CREATE TABLE rooms (
  id integer PRIMARY KEY AUTO_INCREMENT,
  room text
);