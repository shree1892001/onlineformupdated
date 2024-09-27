const BaseFormHandler = require('./BaseFormHandler');
const { waitForSelectorAdd } = require('../utils/puppeteerUtils');
const logger = require('../utils/logger');


class ColoradoHandler extends BaseFormHandler{
    async fillForm(payload) {
        const browser = await this.launchBrowser();
        const page = await browser.newPage();
        try {
            logger.info('Navigating to Texas form URL');
            await page.goto(payload.State.stateUrl);

            // Log and fill form fields
            logger.info('Filling Texas form');
            await waitForSelectorAdd(page, '#fullName', payload.fullName);
            await waitForSelectorAdd(page, '#contact', payload.contact);
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
module.exports =ColoradoHandler ;