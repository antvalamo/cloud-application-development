const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

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
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida.');
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

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
