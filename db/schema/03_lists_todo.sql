DROP TABLE IF EXISTS lists_todo CASCADE;
CREATE TABLE lists_todo (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255),
  create_date TIMESTAMP DEFAULT now(),
  user_id INTEGER REFERENCES users(id),
  category_id INTEGER REFERENCES categories(id)
);
