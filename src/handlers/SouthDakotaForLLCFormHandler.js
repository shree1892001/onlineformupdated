const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');

class SouthDakotaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async SouthDakotaForLLC(page, jsonData,payload){
        logger.info('Navigating to SouthDakota form submission page...');
      let url1="https://sosenterprise.sd.gov/BusinessServices/Business/RegistrationLLC.aspx?d=true";
      const llcurl=url1.split('/RegistrationLLC.aspx?d=true')[1];
      console.log(llcurl)
      const appendurl=`${jsonData.data.State.stateUrl}/RegistrationLLC.aspx?d=true`;
    //   console.log(appendurl);

        await this.navigateToPage(page, appendurl);

        await this.waitForTimeout(2000)
        
       const businessNameInput = [
           { label: 'txtName', value: payload.Name.Legal_Name }
           ];
           await this.addInput(page, businessNameInput);
          
            await this.fillInputByName(page, 'ctl00$MainContent$ucName$txtNameConfirm', payload.Name.Legal_Name);

        logger.info('Filled all input fields successfully.');
        await page.waitForSelector('#ContinueButton', { visible: true, timeout: 5000 });
        await this.clickButton(page, '#ContinueButton');
       // await this.fillInputByName(page, 'ctl00$MainContent$ucName$txtNameConfirm', payload.Name.Legal_Name);
       // await page.click('#ContinueButton');

        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr1', payload.Principal_Address.Street_Address);
        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr2', payload.Principal_Address['Address_Line 2']  || " ");

        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtCity', payload.Principal_Address.City);
        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtPostal', String(payload.Principal_Address.Zip_Code));
        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtEmail', payload.Registered_Agent.EmailId);

        // Wait for the checkbox to be available
        const checkbox = await page.waitForSelector('#chkCopyAddress');
        await checkbox.click();

        await page.click('.btn.btn-success.btn-md');

        await page.waitForSelector('select#ddlRaType', { visible: true });

        // Select the option with value "RA" (Non-Commercial Registered Agent)
        await page.select('select#ddlRaType', 'RA');

        await page.click('#SaveButton');

        await new Promise(resolve => setTimeout(resolve, 3000))
// add button

        await page.waitForSelector('button.btn.btn-default');

        // Click the button using its text
        await page.evaluate(() => {
            const button = Array.from(document.querySelectorAll('button.btn.btn-default'))
            .find(btn => btn.textContent.trim() === 'Add a New Agent');
            if (button) {
            button.click();
            }
        });
        await this.waitForTimeout(10000)
        const FullName = payload.Registered_Agent.keyPersonnelName;
        const [FirstName, LastName] = await this.ra_split(FullName);
        // Assign the split first name and last name to the respective fields
        const Regagent = [
            { label: 'txtFirstName', value: FirstName },
            { label: 'txtLastName', value: LastName }
        ];
        await this.addInput(page, Regagent);
        await this.waitForTimeout(7000)
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtAddr1', payload.Registered_Agent.Address.Street_Address);
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtAddr2', payload.Registered_Agent.Address['Address_Line 2']  || " ");

        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtCity', payload.Registered_Agent.Address.City);
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtPostal', String(payload.Registered_Agent.Address.Zip_Code));
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtEmail', payload.Registered_Agent.EmailId);

        await this.waitForTimeout(7000)
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtAddr1Mail', payload.Registered_Agent.Mailing_Information.Street_Address);
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtAddr2Mail', payload.Registered_Agent.Mailing_Information['Address_Line 2']  || " ");

        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtCityMail', payload.Registered_Agent.Mailing_Information.City);
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtPostalMail', String(payload.Registered_Agent.Mailing_Information.Zip_Code));

        await page.click('.btn.btn-success.btn-md');

        // Organizer info
        await this.waitForTimeout(10000)

        const OrgFullName = payload.Organizer_Information.keyPersonnelName;
        const [orgFirstName, orgLastName] = await this.ra_split(OrgFullName);
        console.log("lastname::",orgLastName)
        // Assign the split first name and last name to the respective fields
        const org = [
            { label: 'txtFirstName', value: orgFirstName },
            { label: 'txtLastName', value: orgLastName }
        ];
        await this.addInput(page, org);

        await new Promise(resolve => setTimeout(resolve, 3000));

        // Wait for the organization name input field and fill it
        // await page.waitForSelector('input[name="ctl00$MainContent$ucOrganizers$txtOrgName"]');
        // await this.fillInputByName(page, 'ctl00$MainContent$ucOrganizers$txtOrgName', payload.Name.Legal_Name);

        // Wait for the address input field and fill it
        await page.waitForSelector('input[name="ctl00$MainContent$ucOrganizers$txtMail1"]');
        await this.fillInputByName(
            page,
            'ctl00$MainContent$ucOrganizers$txtMail1',
            `${payload.organizer_information.Address.street_address}, ${payload.organizer_information.Address.city}, ${payload.organizer_information.Address.zip_code}`
        );

        await new Promise(resolve => setTimeout(resolve, 3000));

        // Wait for the save button and click it
        await page.waitForSelector('#ucOrganizers_SaveButton');
        await page.click('#ucOrganizers_SaveButton');

        await new Promise(resolve => setTimeout(resolve, 5000));

        // Wait for the success button and click it
        await page.waitForSelector('.btn.btn-success.btn-md');
        await page.click('.btn.btn-success.btn-md');

        await new Promise(resolve => setTimeout(resolve, 4000))
        await page.waitForSelector('.btn.btn-success.btn-md');
        await page.click('.btn.btn-success.btn-md');

        // member or manager 

        await page.waitForSelector('select#ddlSelections', { visible: true });
        await page.select('select#ddlSelections', '502');

        await new Promise(resolve => setTimeout(resolve, 3000))

        const memFullName = payload.Organizer_Information.keyPersonnelName;
        const [memFirstName, memLastName] = memFullName.split(' ');
        // Assign the split first name and last name to the respective fields
        const mem = [
            { label: 'txtFirstName', value: memFirstName },
            { label: 'txtLastName', value: memLastName }
        ];
        await this.addInput(page, mem);

        await this.fillInputByName(page, 'ctl00$MainContent$ucManagers$txtOrgName',payload.Name.Legal_Name);
        await this.fillInputByName(page, 'ctl00$MainContent$ucManagers$txtMail1', payload.organizer_information.Address.street_address,',',payload.organizer_information.Address.city,',',payload.organizer_information.Address.zip_code);

        await page.click('.btn.btn-primary.btn-sm');
        
        await new Promise(resolve => setTimeout(resolve, 3000))
        await page.click('.btn.btn-primary.btn-sm');
        await new Promise(resolve => setTimeout(resolve, 3000))

        await page.click('.btn.btn-primary.btn-sm');
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        await page.click('.btn.btn-success.btn-md');
        await new Promise(resolve => setTimeout(resolve, 3000))
        

        await page.click('.btn.btn-success.btn-md');
        await new Promise(resolve => setTimeout(resolve, 3000))


        await new Promise(resolve => setTimeout(resolve, 8000))
        await page.click('.btn.btn-success.btn-md');

        await new Promise(resolve => setTimeout(resolve, 8000))
        await page.click('.btn.btn-success.btn-md');
        const res = "form filled successfully";
        return res

            // Additional form handling code here
        } catch (error) {
            logger.error('Error in South Dakota For LLC form handler:', error.stack);
            throw new Error(`South Dakota For LLC form submission failed: ${error.message}`);
            
        }
        
    }

  
module.exports = SouthDakotaForLLC;
