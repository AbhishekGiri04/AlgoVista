const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const algorithmRoutes = require('./routes/algorithms');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', algorithmRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend server is running!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});