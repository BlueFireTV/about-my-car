-- User
CREATE TABLE Users (
	id SERIAL PRIMARY KEY,
    username VARCHAR(10) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tabelle "Car"
CREATE TABLE Cars (
    id SERIAL PRIMARY KEY,
    vin VARCHAR(255) UNIQUE NOT NULL, 
    hsn VARCHAR(50) NOT NULL,
    tsn VARCHAR(50) NOT NULL,
    enginecode VARCHAR(50),
    transmissioncode VARCHAR(50),
    platenumber VARCHAR(50),
    brand VARCHAR(255),
    model VARCHAR(255),
    model_year VARCHAR(4),
	initial_approval DATE,
    note TEXT,

    -- VRD
    vrd_picture TEXT,

    -- Foreign Keys
    user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabelle "RegularServiceItem"
CREATE TABLE RegularServiceItems (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    interval INT,
    note TEXT,  

    -- Foreign Keys
    car_id INT NOT NULL REFERENCES Cars(id) ON DELETE CASCADE,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inital User 
INSERT INTO Users (username, password, surname, name) VALUES
('admin', '$2b$10$bZMmFhgISc4e0nnoY8Mce.R9fSn5jSMAzbf2JyY19EFpl2LPlWx2y', 'Admin', 'Admin');

-- Inital Car
INSERT INTO Cars (vin, hsn, tsn, enginecode, transmissioncode, platenumber, brand, model, model_year, user_id) VALUES
('WVWZZZ1JZ3W000000', '0603', '123', 'AEX', 'EYK', 'B-12345', 'VW', 'Golf', '2003', 1);

-- Inital RegularServiceItem
INSERT INTO RegularServiceItems (name, date, interval, note, car_id) VALUES
('Ölwechsel', '2020-01-01', 365, 'Ölwechsel mit Filter', 1),
('Bremsen', '2020-01-01', 365, 'Bremsen prüfen', 1),
('Reifen', '2020-01-01', 365, 'Reifen prüfen', 1),
('Zündkerzen', '2020-01-01', 365, 'Zündkerzen prüfen', 1),
('Klima', '2020-01-01', 365, 'Klima prüfen', 1);