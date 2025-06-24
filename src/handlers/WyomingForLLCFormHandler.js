const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class WyomingForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async WyomingForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to wyoming form submission page...');
            const data = Object.values(jsonData)[0];
            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            await this.clickButton(page, '#regStartNow');
            await this.selectRadioButtonById(page, 'MainContent_chkAgree');
            await this.clickDropdown(page, '#MainContent_slctBusType', 'Limited Liability Company (Domestic)');
            await new Promise(resolve => setTimeout(resolve, 5000));
            await page.waitForSelector('#MainContent_ContinueButton');
            await page.click('#MainContent_ContinueButton');
            await this.fillInputByName(page, 'ctl00$MainContent$ucName$txtName', payload.Name.Legal_Name);
            await this.fillInputByName(page, 'ctl00$MainContent$ucName$txtNameConfirm', payload.Name.Legal_Name);
            await this.clickButton(page, '#ContinueButton');
            const isNameREplaced=await this.tryAlternate1(
                page, 
                "#txtName",  // selector2
                "#txtDelayedDate",  // selector1
                payload.Name.Alternate_Legal_Name
              
            );
            
        
            if(isNameREplaced){
            
            await this.fillInputByName(page, 'ctl00$MainContent$ucName$txtNameConfirm', payload.Name.Alternate_Legal_Name);
            await this.clickButton(page, '#ContinueButton');

            }
            await new Promise(resolve => setTimeout(resolve, 5000));
            await this.randomSleep(1000,3000);

            await page.evaluate(() => {
                const continueButton = document.getElementById('ContinueButton');
                continueButton.scrollIntoView();
  
                // Trigger a click event on the continue button
                continueButton.click();
              });
            await this.clickButton(page, '#ContinueButton');
            // await this.clickButton(page, '#ContinueButton');

            const fullName = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = await this.ra_split(fullName);
            const inputFieldsforRA = [
                { selector: '#txtFirstName', value: firstName },        // First Name input
                { selector: '#txtLastName', value: lastName },          // Last Name input (make sure this ID is correct)
                { selector: '#txtAddr1', value: payload.Registered_Agent.Address.Street_Address },
                { selector: '#txtCity', value: payload.Registered_Agent.Address.City },      // City input (ensure proper ID)
            ];
            await this.addInput(page, inputFieldsforRA);
            await this.clickButton(page, '#txtPhone');
            await this.clickButton(page, '.postalCodeListItem:nth-child(1)');
            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtPhone', payload.Registered_Agent.ContactNo);
            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtEmail', payload.Registered_Agent.EmailId);
            await page.click('#chkRAConsent');
            await this.clickButton(page, '#ContinueButton');
            const errorMessageSelector = '#lblErrorMessage';  // Define the selector
            try {
                // Wait for the error message to appear on the page
                await page.waitForSelector(errorMessageSelector, { visible: true, timeout: 5000 });
                console.log('Error message detected.');
                await this.clickButton(page, '#ContinueButton');
            } catch (error) {
                console.log('Error message not found or other issue:', error.message);
                await this.clickButton(page, '#ContinueButton');
            }
            await this.clickButton(page, '#ContinueButton');
            await this.clickButton(page, '#ContinueButton');

            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr1', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr2',  payload.Principal_Address['Address_Line 2'] || " ");

            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtCity', payload.Principal_Address.City);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtState', payload.principal_address.state);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtPostal', String(payload.Principal_Address.Zip_Code));
            
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtPhone', payload.Registered_Agent.ContactNo);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtEmail', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr1Mail', payload.Registered_Agent.Mailing_Information.Street_Address);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr2Mail', payload.Registered_Agent.Mailing_Information['Address_Line 2']  || " ");

            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtCityMail', payload.Registered_Agent.Mailing_Information.City );
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtStateMail', payload.registered_agent.Mailing_Information.state);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtPostalMail',String( payload.Registered_Agent.Mailing_Information.Zip_Code));

            //  //Principal Office Mailing Address
            //  await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr1Mail', payload.principal_addresss.PA_Address_Line_1);
            //  await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtCityMail', payload.principal_addresss.PA_City);
            //  await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtStateMail', payload.principal_addresss.PA_State);
            //  await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtPostalMail', String(payload.Principal_Address.Zip_Code));
 
            await this.clickButton(page, '#ContinueButton');
            const OrgfullName = payload.Organizer_Information.keyPersonnelName;
            const [OrgfirstName, OrglastName] = OrgfullName.split(' ');
            await this.fillInputByName(page, 'ctl00$MainContent$ucParties$txtFirstName', OrgfirstName);
            await this.fillInputByName(page, 'ctl00$MainContent$ucParties$txtLastName', OrglastName);
            await this.fillInputByName(page, 'ctl00$MainContent$ucParties$txtMail1', 
                payload.organizer_information.Address.street_address + ' ,' +
                payload.organizer_information.Address.city + ', ' +
                payload.organizer_information.Address.state + ', ' +
               String( payload.organizer_information.Address.zip_code
            ));
            await this.randomSleep(3000,5000);
            await this.clickButton(page, '#SaveButton');
            await this.clickButton(page, '#SaveButton');

           
            await this.randomSleep(3000,5000);

            await page.waitForSelector('#ContinueButton');
            await page.click('#ContinueButton');
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector('#ContinueButton');
            await page.click('#ContinueButton');
            await page.waitForSelector('#ContinueButton');
            await page.click('#ContinueButton');
            const res = "form filled successfully";
            return res
        } catch (error) {
            logger.error('Error in wyoming For LLC form handler:', error.stack);
            throw new Error(`wyoming For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = WyomingForLLC;
