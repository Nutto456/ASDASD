const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Connect to the SQLite database
const db = new sqlite3.Database('./mydatabase.db');

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Create three tables (you can adjust the schema as needed)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      email TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT,
      price REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);
});

// Define routes for users
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
});

app.post('/users', (req, res) => {
  const { username, email } = req.body;
  db.run('INSERT INTO users (username, email) VALUES (?, ?)', [username, email], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ user_id: this.lastID });
  });
});

app.put('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const { username, email } = req.body;

  db.run('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'User updated successfully' });
  });
});

app.delete('/users/:userId', (req, res) => {
  const userId = req.params.userId;

  db.run('DELETE FROM users WHERE id = ?', userId, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// Define routes for products
app.get('/users', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ products: rows });
  });
});

app.post('/users', (req, res) => {
  const { name, price } = req.body;
  db.run('INSERT INTO products (name, price) VALUES (?, ?)', [name, price], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ product_id: this.lastID });
  });
});

// Add PUT and DELETE routes for products (similar to what you did for users)

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Starting the application...");
});
