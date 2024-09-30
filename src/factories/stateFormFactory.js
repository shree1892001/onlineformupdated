const NewYorkForLLC = require('../handlers/NewYorkForLLCFormHandler'); 
const NewJersyForLLC = require('../handlers/NewJersyForLLCFormHandler');
const NewJersyForCORP = require('../handlers/NewJersyForCORPFormHandler')       
// const MontanaFormHandler = require('../handlers/MontanaFormHandler');
const logger = require('../utils/logger');

class StateFormFactory {
    static async getFormHandler(page, jsonData) {
        const state = jsonData.data.State.stateFullDesc; // Get the state name from jsonData
        logger.info(`Factory creating form handler for state: ${state}`);
        const entity_type = jsonData.data.EntityType.orderShortName

        switch (state) {
            case 'New-York':
                return NewYorkForLLC; 
            case 'New-Jersey':
                if (entity_type == "LLC")
                    return NewJersyForLLC; 
                else if (entity_type == "CORP")
                    return NewJersyForCORP;
            // case 'Montana':
            //     return MontanaFormHandler; // Return function reference for Montana handler
            default:
                logger.warn(`No handler found for state: ${state}`);
                return null; // Return null if no form handler exists for the state
        }
    }
}

module.exports = StateFormFactory;


