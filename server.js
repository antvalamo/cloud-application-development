const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'antonio',
  password: 'root',
  database: 'multimedia_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connection to the database established.');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests only from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  credentials: true, // Allow cookies to be included in requests
};
app.use(cors(corsOptions)); // Apply CORS options to your Express application

app.post('/upload', upload.single('file'), (req, res) => {
  const { name, content, tags } = req.body;
  const filename = req.file.filename;
  const createdAt = new Date();
  const sql = 'INSERT INTO multimedia (name, content, tags, filename, created_at) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [name, content, tags, filename, createdAt], (err, result) => {
    if (err) {
      console.error('Error inserting data into database:', err);
      return res.status(500).json({ error: 'Error uploading file.' });
    }
    res.json({ message: 'Media file uploaded successfully.' });
  });
});

app.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      `SELECT * FROM multimedia WHERE name LIKE ? OR content LIKE ? OR tags LIKE ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    connection.release();
    res.json(results);
  } catch (error) {
    console.error('Error while searching for files:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
