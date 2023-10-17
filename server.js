const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'antonio',
  password: 'root',
  database: 'multimedia_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};
app.use(cors(corsOptions));

app.post('/upload', upload.single('file'), async (req, res) => {
  const { name, content, tags } = req.body;
  const filename = req.file.filename;
  const createdAt = new Date();
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO multimedia (name, content, tags, filename, created_at) VALUES (?, ?, ?, ?, ?)',
      [name, content, tags, filename, createdAt]
    );
    connection.release();
    res.json({ message: 'Media file uploaded successfully.' });
  } catch (error) {
    console.error('Error inserting data into database:', error);
    res.status(500).json({ error: 'Error uploading file.' });
  }
});

app.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const [results] = await connection.execute(
      'SELECT * FROM multimedia WHERE name LIKE CONCAT("%", ?, "%") OR content LIKE CONCAT("%", ?, "%") OR tags LIKE CONCAT("%", ?, "%")',
      [query, query, query]
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
