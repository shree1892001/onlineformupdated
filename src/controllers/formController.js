const formService = require('../services/formService');
const logger = require('../utils/logger');  // Import logger

exports.submitForm = async (req, res, next) => {
    try {
        const payload = req.body;
        logger.info('Received form submission request', { payload });  // Log incoming request payload

        await formService.processForm(payload);
        res.status(200).send({ message: 'Form submitted successfully' });

        logger.info('Form submission succeeded');
    } catch (error) {
        logger.error('Error processing form submission', error);  // Log errors
        next(error);
    }
};
