const puppeteer = require('puppeteer');
const stateFormFactory = require('D:/vState-online-form-submission/src/factories/stateFormFactory.js');
const logger = require('D:/vState-online-form-submission/src/utils/logger');

exports.processForm = async (page,jsonData) => {
    try {
        logger.info(`Processing form for state: ${jsonData.data.State.stateFullDesc}`);

        const formHandler = await stateFormFactory.getFormHandler(page, jsonData);
        console.log(typeof formHandler)
        if (typeof formHandler !== 'function') {
            throw new Error(`No form handler available for state: ${jsonData.data.State.stateFullDesc}`);
        }

        await formHandler(page, jsonData);
        logger.info(`Form successfully processed for state: ${jsonData.data.State.stateFullDesc}`);
    } catch (error) {
        logger.error(`Error processing form for state: ${jsonData.data.State.stateFullDesc}`, error);
        throw error;
    }
};
