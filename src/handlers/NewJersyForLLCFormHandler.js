const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class NewJersyForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async NewJersyForLLC(page, jsonData, payload) {
        try {
            logger.info('Navigating to New Jersey form submission page...');
            const data = Object.values(jsonData)[0];
            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            await this.clickDropdown(page, '#BusinessType', 'NJ Domestic Limited Liability Company (LLC)');
            
            // Update payload access to match new structure
            const name1 = payload.Name.Legal_Name;
            const [name, designator] = await this.extractnamedesignator(name1); 
            console.log(name, designator);
            const businessNameFields = [
                { label: 'BusinessName', value: name}
            ];
            await this.addInput(page, businessNameFields);
            await page.keyboard.press('Enter');
            
            const name2 = payload.Name.Alternate_Legal_Name;
            const [name3, designator1] = await this.extractnamedesignator(name2); 

            //alternate legal name 
            const isNameREplaced = await this.tryAlternate(
                page, 
                "#BusinessName",
                "#BusinessNameDesignator",
                "input.btn.btn-success[value='Continue']",
                name3
            );

            await this.randomSleep();
            await this.clickDropdown(page, '#BusinessNameDesignator', designator);
            await page.keyboard.press('Enter'); 
            await this.clickButton(page, '.btn.btn-success');
            await new Promise(resolve => setTimeout(resolve, 3000));
            await page.waitForSelector('#btnSubmit');
            await page.click('#btnSubmit');
            await new Promise(resolve => setTimeout(resolve, 3000));
            await page.waitForSelector('#btnSubmit');
            await page.click('#btnSubmit');
            await this.clickButton(page, 'input[name="continuebtn"]');
            await this.clickButton(page, '#ra-num-link a');
            
            // Update registered agent information access
            await this.fillInputByName(page, 'RegisteredAgentName', payload.Registered_Agent.keyPersonnelName);
            await this.fillInputByName(page, 'OfficeAddress1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'OfficeAddress2', payload.Registered_Agent.Address['Address_Line 2'] || " ");

            await this.fillInputByName(page, 'OfficeCity', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'OfficeZip', String(payload.Registered_Agent.Address.Zip_Code));
            await this.selectCheckboxByLabel(page, 'I attest that the Registered Agent information entered is correct for this business');
            await this.clickButton(page, '.btn.btn-success');
            await this.clickButton(page, '#continue-btn');
            await this.clickButton(page, 'input.btn.btn-success[value="Continue"]');
            await new Promise(resolve => setTimeout(resolve, 5000));
            await page.waitForSelector('a.btn.btn-success#add-signer-btn', { visible: true, timeout: 60000 });
            await page.click('a.btn.btn-success#add-signer-btn');
            
            await this.fillInputByName(page, 'Name', payload.Organizer_Information.keyPersonnelName);
            await this.clickDropdown(page, '#Title', 'Authorized Representative');
            await this.clickButton(page, '#modal-save-btn');
            await this.randomSleep();
            await page.reload();
            await page.waitForSelector('label[for="sign-ckbx-0"]', { visible: true, timeout: 3000 });
            await page.click('label[for="sign-ckbx-0"]');
            await this.clickButton(page, '#continue-btn');
            const res = "form filled successfully";
            return res;
        } catch (error) {
            logger.error('Error in NewJersy For LLC form handler:', error.stack);
            throw new Error(`NewJersy For LLC form submission failed: ${error.message}`);
        }
    }
}
module.exports = NewJersyForLLC;
