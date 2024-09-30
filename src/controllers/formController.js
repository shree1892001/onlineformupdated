const formService = require('D:/vState-online-form-submission/src/services/formService.js');
const logger = require('D:/vState-online-form-submission/src/utils/logger');

exports.submitForm = async (page,jsonData, next,res) => {
    try {
        logger.info('Received form submission request', { payload: jsonData });
        console.log("formcontroller::",jsonData)
        await formService.processForm(page, jsonData);
       
        res.status(200).send({ message: 'Form submitted successfully' });

        logger.info('Form submission succeeded');
    } catch (error) {
        logger.error('Error processing form submission', error);
        next(error);
    }
};
