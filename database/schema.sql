CREATE DATABASE IF NOT EXISTS store_rating;
USE store_rating;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role ENUM('ADMIN', 'NORMAL_USER', 'STORE_OWNER') NOT NULL DEFAULT 'NORMAL_USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_email (email)
);

CREATE TABLE IF NOT EXISTS stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255),
  address VARCHAR(400),
  owner_id INT NOT NULL,
  avg_rating DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_stores_owner (owner_id),
  INDEX idx_stores_name (name)
);

CREATE TABLE IF NOT EXISTS ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  score TINYINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_store (user_id, store_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_ratings_store (store_id)
);

-- Default admin: admin@store.com / Admin@12345
-- Name must be 20-60 characters per challenge rules
INSERT INTO users (name, email, password_hash, address, role)
SELECT
  'System Administrator',
  'admin@store.com',
  '$2b$10$CsBdDxqUSg/yXcmnwvvKdeivh6IgrFUxsuLAg004yNxfNPHoLY/Ra',
  '123 Admin Street, City Center',
  'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@store.com');
