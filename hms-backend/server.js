// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('Apollo General HMS backend is running ✅');
});



// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server running on http://localhost:${PORT}');


});
