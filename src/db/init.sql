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
	picture TEXT,

    -- VRD
    vrd_picture TEXT,

    -- Foreign Keys
    user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabelle "RegularServiceItem"
CREATE TABLE RegularServiceItem (
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