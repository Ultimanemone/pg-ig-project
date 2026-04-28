const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ===================== IMPORT ROUTES =====================
const userRoutes = require('./backend/routes/user');
const resourceRoutes = require('./backend/routes/resource');
const loggingRoutes = require('./backend/routes/logging');

// ===================== USE ROUTES =====================
app.use('/api', userRoutes);
app.use('/api', resourceRoutes);
app.use('/api', loggingRoutes);

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});