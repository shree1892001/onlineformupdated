const CaliforniaFormHandler = require('../handlers/CaliforniaFormHandler');
const TexasFormHandler = require('../handlers/TexasFormHandler');
const logger = require('../utils/logger');  // Import logger

class StateFormFactory {
    static getFormHandler(state) {
        logger.info(`Factory creating form handler for state: ${state}`);  // Log handler creation

        switch (state.toLowerCase()) {
            case 'california':
                return new CaliforniaFormHandler();
            case 'texas':
                return new TexasFormHandler();
            // Add more cases for other states
            default:
                logger.warn(`No handler found for state: ${state}`);  // Log missing handler
                return null;
        }
    }
}

module.exports = StateFormFactory;
