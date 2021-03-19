CREATE TABLE `user` (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE offer (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    genre VARCHAR(30) NOT NULL,
    author VARCHAR(100) NOT NULL,
    book_name VARCHAR(100) NOT NULL,
    rating INT,
    review VARCHAR(1000),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);
