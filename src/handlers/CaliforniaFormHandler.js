const BaseFormHandler = require('./BaseFormHandler');
const { waitForSelectorAndType } = require('../utils/puppeteerUtils');
const logger = require('../utils/logger');  // Import logger

class CaliforniaFormHandler extends BaseFormHandler {
    async fillForm(payload) {
        const browser = await this.launchBrowser();
        const page = await browser.newPage();

        try {
            logger.info('Navigating to California form URL');
            await page.goto('https://www.california-form-url.com');

            // Log and fill form fields
            logger.info('Filling California form');
            await waitForSelectorAndType(page, '#name', payload.name);
            await waitForSelectorAndType(page, '#email', payload.email);
            await page.click('#submit-button');

            logger.info('Form submitted successfully for California');
            await browser.close();
        } catch (error) {
            logger.error('Error in CaliforniaFormHandler:', error);  // Log errors
            await browser.close();
            throw error;
        }
    }
}

module.exports = CaliforniaFormHandler;
