const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cors = require('cors');
const formController = require('./controllers/formController'); // Ensure this path is correct
const logger = require('./utils/logger'); // Ensure this path is correct

puppeteer.use(StealthPlugin());
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
    origin: [
        'chrome-extension://kpmpcomcmochjklgamghkddpaenjojhl',
        'http://192.168.1.4:3000',
        'http://192.168.1.108:3001',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST']
}));

// Puppeteer script logic
async function runPuppeteerScript(req, res) {
    let browser;
    try {
        const jsonData = req.body;

        // Navigate to the state URL
        browser = await puppeteer.launch({
            headless: false,
            args: [
                '--start-maximized',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--ignore-certificate-errors',
                '--ignore-certificate-errors-spki-list',
                '--disable-blink-features=AutomationControlled',
                '--disable-notifications'
            ],
            ignoreHTTPSErrors: true,
            slowMo: 50
        });

        const page = await browser.newPage();

        // Call the formController's submitForm method directly, passing req, res, and formData
        await formController.submitForm(page,jsonData, console.error,res);

    } catch (error) {
        logger.error('Error during Puppeteer script execution: ' + error.message, error);
        res.status(500).send({ error: 'Puppeteer script execution failed' });
    } 
}

// Routes
app.post('/run-puppeteer', async (req, res) => {
    if (!req.body.data || !req.body.data.State || !req.body.data.State.stateUrl) {
        return res.status(400).send({ error: 'Invalid input data' });
    }

    await runPuppeteerScript(req, res);
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
