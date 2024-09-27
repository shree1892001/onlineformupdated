const express = require('express');
const dotenv = require('dotenv');
const formController = require('./controllers/formController');
const logger = require('./utils/logger');  // Import logger

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON
app.use(express.json());

// Routes
app.post('/submit-form', formController.submitForm);

// Global error handler
app.use((err, req, res, next) => {
    logger.error('Global Error Handler: ' + err.message, err); // Log error with stack trace
    res.status(500).send({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
