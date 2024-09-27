const BaseFormHandler = require('./BaseFormHandler');
const { waitForSelectorAndType } = require('../utils/puppeteerUtils');
const logger = require('../utils/logger');  // Import logger

class TexasFormHandler extends BaseFormHandler {
    async fillForm(payload) {
        const browser = await this.launchBrowser();
        const page = await browser.newPage();

        try {
            logger.info('Navigating to Texas form URL');
            await page.goto('https://www.texas-form-url.com');

            // Log and fill form fields
            logger.info('Filling Texas form');
            await waitForSelectorAndType(page, '#fullName', payload.fullName);
            await waitForSelectorAndType(page, '#contact', payload.contact);
            await page.click('#submitForm');

            logger.info('Form submitted successfully for Texas');
            await browser.close();
        } catch (error) {
            logger.error('Error in TexasFormHandler:', error);  // Log errors
            await browser.close();
            throw error;
        }
    }
}

module.exports = TexasFormHandler;
