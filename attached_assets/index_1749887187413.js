const express = require('express');
const cors = require('cors'); // ✅ FIX: import cors module
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve AI Movie Studio frontend
app.use('/studio', express.static(__dirname + '/AI_Movie_Studio_Pro'));

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Hello from REST Express, Ervin!');
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
