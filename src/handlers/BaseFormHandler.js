const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const logger = require('../utils/logger');  // Import logger
puppeteer.use(StealthPlugin());

class BaseFormHandler {
    constructor() {
        if (new.target === BaseFormHandler) {
            throw new Error('Cannot instantiate BaseFormHandler directly');
        }
    }

    async fillForm(payload) {
        throw new Error('fillForm method must be implemented in subclass');
    }

    async launchBrowser() {
        logger.info('Launching Puppeteer browser');  // Log browser launch
        return await puppeteer.launch({ headless: true });
    }
}

module.exports = BaseFormHandler;
