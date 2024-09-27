const logger = require('./logger');  // Import logger

exports.waitForSelectorAndType = async (page, selector, text) => {
    logger.info(`Typing into selector: ${selector}`);
    await page.waitForSelector(selector);
    await page.type(selector, text);
};
