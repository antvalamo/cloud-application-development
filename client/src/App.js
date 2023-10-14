import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('content', content);
    formData.append('tags', tags);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('File uploaded successfully.');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. See the console for more details.');
    }
  };

  return (
    <div className="App">
      <h1>Upload media files</h1>
      <input type="file" onChange={handleFileChange} />
      <br />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Tags (separated by commas)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <br />
      <button onClick={handleUpload}>Upload file</button>
    </div>
  );
}

export default App;
