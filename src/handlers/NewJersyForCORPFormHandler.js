const logger = require('../utils/logger');
const BaseFormHandler = require('./BaseFormHandler');

class NewJersyForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async NewJersyForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            // await clickDropdown(page, '#BusinessType');
            await this.clickDropdown(page, '#BusinessType', 'NJ Domestic For-Profit Corporation (DP)');
            const name1=payload.Name.Legal_Name;
            const [name ,designator] = await this.extractnamedesignator(name1); 
            const businessNameFields = [{ label: 'BusinessName', value: name }];
            await this.addInput(page, businessNameFields);
            await page.keyboard.press('Enter');
            //alternate legal name 
            const name2=payload.Name.Alternate_Legal_Name;
            const [name3, designator1] = await this.extractnamedesignator(name2); 
            const isNameREplaced=await this.tryAlternate(
                page, 
                "#BusinessName",  // selector2
                "#BusinessNameDesignator",  // selector1
                "input.btn.btn-success[value='Continue']",  // nextbtnSelec
                name3
              
            );
            await this.clickDropdown(page, '#BusinessNameDesignator',designator);
            await this.clickButton(page, '.btn.btn-success');
            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.fillInputByName(page, 'TotalShares', payload.Stock_Details.SI_Number_Of_Shares);

            await new Promise(resolve => setTimeout(resolve, 2000))
            await page.waitForSelector('#btnSubmit');
            await page.click('#btnSubmit');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await page.waitForSelector('#btnSubmit');
            await page.click('#btnSubmit');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.clickButton(page, 'input[name="continuebtn"]'); 
            await this.clickButton(page, '#ra-num-link a'); // Click the Registered Agent link
            await this.fillInputByName(page, 'RegisteredAgentName', payload.Registered_Agent.keyPersonnelName);
            await this.fillInputByName(page, 'OfficeAddress1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'OfficeAddress2', payload.Registered_Agent.Address['Address_Line 2']  || " ");

            await this.fillInputByName(page, 'OfficeCity', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'OfficeZip', payload.Registered_Agent.Address.Zip_Code);

            await this.selectCheckboxByLabel(page, 'I attest that the Registered Agent information entered is correct for this business');
            await this.clickButton(page, '.btn.btn-success'); // Submit
            await new Promise(resolve => setTimeout(resolve, 10000))
            await page.waitForSelector('#add-member-btn');
            await page.click('#add-member-btn');
            await this.fillInputByName(page, 'Name', payload.Director_Information.Director_Details.Name);
            await this.fillInputByName(page, 'StreetAddress1', payload.Director_Information.Address.Dir_Address_Line_1);
            await this.fillInputByName(page, 'StreetAddress2', payload.Director_Information.Address.Dir_Address_Line_2  || " ");

            await this.fillInputByName(page, 'City', payload.Director_Information.Address.Dir_City);


           
            if(payload.Director_Information.Address.Dir_State==="NJ"){
                console.log(payload.Director_Information.Address.Dir_State);
                await this.clickDropdown(page, '#State', "New Jersey");
 
            }
            else{
 
                await this.clickDropdown(page, '#State', payload.Director_Information.Address.Dir_State);
            }
            
            await this.fillInputByName(page, 'Zip', String(payload.Director_Information.Address.Dir_Zip_Code));
            await page.evaluate(() => {
                document.body.style.zoom = '90%';
            });
            await this.clickButton(page, '.btn.btn-primary');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.clickButton(page, '#continue-btn');
            await new Promise(resolve => setTimeout(resolve, 10000))
            // await page.waitForSelector('.btn.btn-success[title="Add New Incorporators"]', { visible: true });
            await page.evaluate(() => {
                const button = document.getElementById('add-member-btn');
                if (button) {
                    button.click();
                }
            }); 
            await page.waitForSelector('#add-member-btn');
            await page.click('#add-member-btn');       
            await this.fillInputByName(page, 'Name', payload.Incorporator_Information.Incorporator_Details.Inc_Name);
            await this.fillInputByName(page, 'StreetAddress1', payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page, 'StreetAddress2', payload.Incorporator_Information.Address['Address_Line 2']  || " ");

            await this.fillInputByName(page, 'City', payload.Incorporator_Information.Address.City);
            if(payload.Incorporator_Information.Address.Inc_State==="NJ"){
                console.log(payload.Incorporator_Information.Address.Inc_State);
                await this.clickDropdown(page, '#State', "New Jersey");
 
            }
            else{
 
                await this.clickDropdown(page, '#State', payload.Incorporator_Information.Address.Inc_State);
            }
            await this.fillInputByName(page, 'Zip', String(payload.Incorporator_Information.Address.Zip_Code));
 
            await page.evaluate(() => {
                document.body.style.zoom = '90%';
            });
            await this.clickButton(page, '.btn.btn-primary');
            await page.evaluate(() => {
                document.body.style.zoom = '100%';
            });
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.clickButton(page, '#continue-btn')
            await this.clickButton(page, 'input.btn.btn-success[value="Continue"]');
            const labelSelector = 'label[for="signing"]';
            await page.waitForSelector(labelSelector, { visible: true, timeout: 30000 });
            await page.reload()
            await page.click(labelSelector);
            console.log(`Clicked the label for checkbox: ${labelSelector}`);
            await page.evaluate(() => {
                const checkbox = document.querySelector('#signing');
                return checkbox ? checkbox.checked : null; // Return checked state or null if not found
            });
            await this.clickButton(page, '#continue-btn')
            const res = "form filled successfully";
            return res
        } catch (error) {
            logger.error('Error in NewJersy For CORP form handler:', error.stack);
            throw new Error(`NewJersy For CORP form submission failed: ${error.message}`);
        }
    }
}
module.exports = NewJersyForCORP;
