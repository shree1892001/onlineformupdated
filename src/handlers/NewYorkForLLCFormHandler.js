const logger = require('../utils/logger');
const {navigateToPage,clickLinkByLabel, addInput, submitForm, randomSleep } = require('../utils/puppeteerUtils');


async function NewYorkForLLC(page, jsonData) {
    try {
        logger.info('Navigating to New York form submission page...');
        const url = jsonData.data.State.stateUrl
        await navigateToPage(page, url)
        const inputFields = [
            { label: 'Username', value: jsonData.data.State.filingWebsiteUsername },
            { label: 'Password', value: jsonData.data.State.filingWebsitePassword }
        ];

        await addInput(page, inputFields);
        logger.info('Login form filled out successfully for New York LLC.');
        await submitForm(page);
        await clickLinkByLabel(page, 'Domestic Business Corporation (For Profit) and Domestic Limited Liability Company');
        await clickLinkByLabel(page,'Articles of Organization for a Domestic Limited Liability Company (not for professional service limited liability companies)');
        const LLCfieldinput = [
            { label: 'P2_ENTITY_NAME', value: jsonData.data.Payload.Name.CD_Legal_Name },
        ];
        await addInput(page, LLCfieldinput);
        await randomSleep()
        await submitForm(page);
        await page.waitForSelector('#P4_INITIAL_STATEMENT_0', { visible: true });
        await page.click('#P4_INITIAL_STATEMENT_0');
        const articlefields = [
            { label: 'P4_ENTITY_NAME', value: jsonData.data.Payload.Name.CD_Legal_Name },
            {label:'P4_COUNTY',value: jsonData.data.Payload.County.CD_County }]
        const registerAgentFields = [{ label: 'P4_RA_NAME', value: jsonData.data.Payload.Registered_Agent.Name.RA_Name },
            {label:'P4_RA_ADDR1',value: jsonData.data.Payload.Registered_Agent.Address.RA_Address_Line1 },
            { label: 'P4_RA_CITY', value: jsonData.data.Payload.Registered_Agent.Address.RA_City },
            {label:'P4_RA_POSTAL_CODE',value: jsonData.data.Payload.Registered_Agent.Address.RA_Postal_Code }]
        const pricipleAddressFields = [{ label: 'P4_SOP_NAME', value: jsonData.data.Payload.Name.CD_Alternate_Legal_Name },
            {label:'P4_SOP_ADDR1',value: jsonData.data.Payload.Principal_Address.PA_Address_Line1 },
            { label: 'P4_SOP_CITY', value: jsonData.data.Payload.Principal_Address.PA_City },
            {label:'P4_SOP_POSTAL_CODE',value: jsonData.data.Payload.Principal_Address.PA_Postal_Code }]
        const organizerFields = [{label:'P4_ORGANIZER_NAME',value: jsonData.data.Payload.Organizer_Information.Organizer_Details.Org_Name },
            {label:'P4_SIGNATURE',value: jsonData.data.Payload.Organizer_Information.Organizer_Details.Org_Name },
            {label:'P4_FILER_NAME',value: jsonData.data.Payload.Organizer_Information.Organizer_Details.Org_Name },
            {label:'P4_FILER_ADDR1',value: jsonData.data.Payload.Organizer_Information.Org_Address.Org_Address_Line1 },
            {label:'P4_FILER_CITY',value: jsonData.data.Payload.Organizer_Information.Org_Address.Org_City },
            {label:'P4_FILER_POSTAL_CODE',value: jsonData.data.Payload.Organizer_Information.Org_Address.Org_Postal_Code }
        ];
        await addInput(page, articlefields);
        await addInput(page, registerAgentFields);
        await addInput(page, pricipleAddressFields);
        await addInput(page, organizerFields);
        await page.evaluate(() => {
            apex.submit({ request: 'CONTINUE', validate: true });
        });

    } catch (error) {
        // Log full error stack for debugging
        logger.error('Error in New York LLC form handler:', error.stack);
        throw new Error(`New York LLC form submission failed: ${error.message}`);
    }
}

module.exports = NewYorkForLLC;




