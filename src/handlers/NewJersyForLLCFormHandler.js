const { add } = require('winston');
const logger = require('../utils/logger');
const {navigateToPage,clickDropdown,selectCheckboxByLabel, addInput,clickButton  } = require('../utils/puppeteerUtils');

async function NewJersyForLLC(page, jsonData) {
    try {
        logger.info('Navigating to New York form submission page...');
        const url = jsonData.data.State.stateUrl;
        await navigateToPage(page, url);
        await clickDropdown(page, '#BusinessType');
        const businessNameFields = [
            { label: 'BusinessType', value: 'NJ Domestic Limited Liability Company (LLC)' },
            { label: 'BusinessName', value: jsonData.data.Payload.Name.CD_Legal_Name }
        ];
        await addInput(page, businessNameFields);
        await page.keyboard.press('Enter');
        await clickDropdown(page, '#BusinessNameDesignator');
        const businessDesignatorFields = [{ label: 'BusinessNameDesignator', value: 'LLC' }];
        await addInput(page, businessDesignatorFields);
        await page.keyboard.press('Enter');
        await clickButton(page, '.btn.btn-success'); // Click the submit button
        await page.waitForSelector('#btnSubmit');
        await page.click('#btnSubmit');
        await page.waitForSelector('#btnSubmit');
        await page.click('#btnSubmit');
        await clickButton(page, 'input[name="continuebtn"]'); // Click the continue button
        await clickButton(page, '#ra-num-link a'); // Click the Registered Agent link
        const RegisteredAgentFields = [
            { label: 'RegisteredAgentName', value: jsonData.data.Payload.Registered_Agent.RA_Name },
            { label: 'OfficeAddress1', value: jsonData.data.Payload.Registered_Agent.RA_Address.RA_Address_Line1 },
            { label: 'OfficeCity', value: jsonData.data.Payload.Registered_Agent.RA_Address.RA_City },
            { label: 'OfficeZip', value: jsonData.data.Payload.Registered_Agent.RA_Address.RA_Postal_Code }
        ];
        await addInput(page, RegisteredAgentFields);
        await selectCheckboxByLabel(page, 'I attest that the Registered Agent information entered is correct for this business');
        await clickButton(page, '.btn.btn-success'); // Submit
        await clickButton(page, '#continue-btn');
        await clickButton(page, 'input.btn.btn-success[value="Continue"]');
        await page.waitForSelector('a.btn.btn-success#add-signer-btn', { visible: true, timeout: 60000 });
        await page.click('a.btn.btn-success#add-signer-btn');
        const signerfield = [{ label: 'Name', value: jsonData.data.Payload.Organizer_Information.Organizer_Details.Org_Name }];
        await addInput(page, signerfield);
        await clickDropdown(page, '#Title');
        await page.select('#Title', 'Authorized Representative');
        await clickButton(page, '#modal-save-btn'); // Save
        await page.waitForSelector('#sign-ckbx-0', { visible: true, timeout: 60000 }); // Wait for the checkbox to be visible
        await page.click('#sign-ckbx-0');
            await clickButton(page, '#continue-btn');
    } catch (error) {
        logger.error('Error in New Jersey LLC form handler:', error.stack);
        throw new Error(`New Jersey LLC form submission failed: ${error.message}`);
    }
}

module.exports = NewJersyForLLC;
