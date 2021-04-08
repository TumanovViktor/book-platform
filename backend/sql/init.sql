CREATE TABLE `user` (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL,
    image VARCHAR(65535),
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

ALTER TABLE offer ADD CONSTRAINT FK_offer_owner FOREIGN KEY (user_id) REFERENCES user(id);

CREATE TABLE favourite_offer (
    user_id INT NOT NULL,
    offer_id INT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT UK_user_offer UNIQUE(user_id, offer_id)
);

ALTER TABLE favourite_offer ADD CONSTRAINT FK_fav_offer_user FOREIGN KEY (user_id) REFERENCES user(id);
ALTER TABLE favourite_offer ADD CONSTRAINT FK_fav_offer_offer FOREIGN KEY (offer_id) REFERENCES offer(id);

CREATE TABLE offer_chat (
    id INT NOT NULL AUTO_INCREMENT,
    offer_id INT NOT NULL,
    bidder_id INT NOT NULL, -- bidder = interested person
    from_user_id INT NOT NULL, -- bidder or owner
    message VARCHAR(255) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);

ALTER TABLE offer_chat ADD CONSTRAINT FK_offer_chat_bidder FOREIGN KEY (bidder_id) REFERENCES user(id);
ALTER TABLE offer_chat ADD CONSTRAINT FK_offer_chat_user FOREIGN KEY (from_user_id) REFERENCES user(id);
ALTER TABLE offer_chat ADD CONSTRAINT FK_offer_chat_offer FOREIGN KEY (offer_id) REFERENCES offer(id);
