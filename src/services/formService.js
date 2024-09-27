const stateFormFactory = require('../factories/stateFormFactory');
const { handleError } = require('../utils/errorHandler');
const logger = require('../utils/logger');  // Import logger

exports.processForm = async (payload) => {
    try {
        const { state } = payload;
        logger.info(`Processing form for state: ${state}`);  // Log the state being processed

        const formHandler = stateFormFactory.getFormHandler(state);

        if (!formHandler) {
            throw new Error(`No form handler available for state: ${state}`);
        }

        await formHandler.fillForm(payload);
        logger.info(`Form successfully processed for state: ${state}`);
    } catch (error) {
        logger.error(`Error processing form for state: ${payload.state}`, error);  // Log errors
        handleError(error);
        throw error;  // Rethrow to pass it up to the controller
    }
};
