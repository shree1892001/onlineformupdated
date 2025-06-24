const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');

class WashingtonForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async WashingtonForLLC(page, jsonData,payload){
        logger.info('Navigating to Washington form submission page...');
        const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
        await this.navigateToPage(page, url);
        await this.fillInputByName(page, 'Username', data.State.filingWebsiteUsername);
        await this.fillInputByName(page, 'Password', data.State.filingWebsitePassword);

        await page.click('button.btn.btn-default.btn-lg.button_bg');

        await page.waitForSelector('span.txt', { visible: true });
        await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('span.txt'));
            const targetElement = elements.find(el => el.textContent.trim() === 'Create or Register a Business');
            if (targetElement) {
                targetElement.click();
            }
        });

        await new Promise(resolve => setTimeout(resolve, 4000))
        await page.waitForSelector('#rdoDomestic');
        await page.click('#rdoDomestic');

        await new Promise(resolve => setTimeout(resolve, 5000))
        await this.clickDropdown(page, '#BusinessEntityType', 'WA LIMITED LIABILITY COMPANY');

        // Wait for the button with the class 'btn btn-success btn-md' and click it
        await page.waitForSelector('input.btn.btn-success.btn-md', { visible: true });
        await page.click('input.btn.btn-success.btn-md');
        
        // await this.addInput(page, entity);
        await new Promise(resolve => setTimeout(resolve, 5000))
        await this.fillInputByName(page,'txtBusiessName',payload.Name.Legal_Name)
        await page.waitForSelector('input.btn.btn-md.btn-brown', { visible: true });
        await page.click('input.btn.btn-md.btn-brown');
        await this.waitForTimeout(7000)
        
        
        const fullName = payload.Registered_Agent.keyPersonnelName;

        // Split the full name into first and last name
        const [first, last] = await this.ra_split(fullName); // Adjust the split criteria if names have multiple parts

        // Selector for the first name input field
        const firstnameSelector = 'input[data-ng-model="agent.FirstName"]';
        await page.waitForSelector(firstnameSelector);
        await page.type(firstnameSelector, first || ''); // Fills first name

        // Selector for the last name input field
        const lastnameSelector = 'input[data-ng-model="agent.LastName"]';
        await page.waitForSelector(lastnameSelector);
        await page.type(lastnameSelector, last || ''); 

        // // Selector for the fisrt last name input field
        // const firstname = 'input[data-ng-model="agent.FirstName"]'; 
        // const first = payload.Registered_Agent.Name.RA_Name; 
        // await page.waitForSelector(firstname);
        // await page.type(firstname, first);

        // const lastname = 'input[data-ng-model="agent.LastName"]'; 
        // const last = payload.Registered_Agent.Name.RA_Name; 
        // await page.waitForSelector(lastname);
        // await page.type(lastname, last);

        await page.waitForSelector('input.btn.btn-success.btn-md', { visible: true });
        await page.click('input.btn.btn-success.btn-md');
        
        // Wait for the button with 'value="Add New Agent"' to be visible
        await page.waitForSelector('input[value="Add New Agent"]', { visible: true });
        await page.evaluate(() => {
            document.querySelector('input[value="Add New Agent"]').click();
        });

        const emailInputSelector = 'input[name="EmailID"]'; // Select by 'name' attribute
        const emailValue = payload.Registered_Agent.EmailId; // Ensure this is the value you want to fill
        await page.waitForSelector(emailInputSelector);
        await page.type(emailInputSelector, emailValue); 

        // Selector for the ConfirmEmailAddress input field
        const emailConfirmInputSelector = 'input[name="ConfirmEmailAddress"]'; 
        const emailConfirmValue = payload.Registered_Agent.EmailId; 
        await page.waitForSelector(emailConfirmInputSelector);
        await page.type(emailConfirmInputSelector, emailConfirmValue);


        // Selector for the StreetAddress1 input field
        const streetAddressInputSelector = 'input[name="StreetAddress1"]';
        const streetAddressValue = payload.Registered_Agent.Address.Street_Address; 
        await page.waitForSelector(streetAddressInputSelector);
        await page.type(streetAddressInputSelector, streetAddressValue);


        // // Selector for the StreetAddress2 input field
        const streetAddress2InputSelector = 'input[name="StreetAddress2"]';
        const streetAddress2Value = payload.Registered_Agent.Address['Address_Line 2']  || " "; 
        await page.waitForSelector(streetAddress2InputSelector);
        await page.type(streetAddress2InputSelector, streetAddress2Value);


        // Selector for the Zip input field
        const zipInputSelector = 'input[name="Zip5"]';
        const zipValue = payload.Registered_Agent.Address.Zip_Code; 
        await page.waitForSelector(zipInputSelector);
        await page.type(zipInputSelector, zipValue);

        // // Checkbox
        // await new Promise(resolve => setTimeout(resolve, 6000))
        // await page.click('input[ng-model="agent.IsACP"]');


        // //  Principal Office

            await new Promise(resolve => setTimeout(resolve, 6000))

            //       // Selector for the Phone input field
            // const phoneInputSelector = 'input[name="txtPhone"]';
            // const phoneValue = payload.Registered_Agent.Name.Contact_No; // Ensure this is the correct value in your JSON
            // await page.waitForSelector(phoneInputSelector);
            // await page.type(phoneInputSelector, phoneValue);


            const emailInputSelecto = 'input[data-ng-model="principalData.EmailAddress"]';
            // Extract the email value from your JSON data
            const emailValuE1 = payload.Registered_Agent.EmailId; 
            await page.waitForSelector(emailInputSelecto, { visible: true, timeout: 6000 }); 
            await page.type(emailInputSelecto, emailValuE1, { delay: 100 }); 

            // Selector for the Confirm Email input field
            const confirmEmailInputSelector = 'input[name="ConfirmEmail"]';
            const confirmEmailValue = payload.Registered_Agent.EmailId; 
            await page.waitForSelector(confirmEmailInputSelector);
            await page.type(confirmEmailInputSelector, confirmEmailValue);


            const principalOfficeHeaderSelector = '.div_pdf_header_font.div_header.ng-binding';
            await page.waitForSelector(principalOfficeHeaderSelector);
            const streetAddress1Selector = `${principalOfficeHeaderSelector} ~ div input[name="StreetAddress1"]`;
            const streetAddress1Value1 = payload.Principal_Address.Street_Address; 
            // Wait for and type into the StreetAddress1 input field
            await page.waitForSelector(streetAddress1Selector);
            await page.type(streetAddress1Selector, streetAddress1Value1);

            const streetAddress2Selector = `${principalOfficeHeaderSelector} ~ div input[name="StreetAddress2"]`;
            const streetAddress2Value2 = payload.Principal_Address['Address_Line 2'] || " "; 
            // Wait for and type into the StreetAddress1 input field
            await page.waitForSelector(streetAddress2Selector);
            await page.type(streetAddress2Selector, streetAddress2Value2);



            const principalOfficeHeaderSelector2 = '.div_pdf_header_font.div_header.ng-binding';
            await page.waitForSelector(principalOfficeHeaderSelector2);
            const streetAddress1Selector2 = `${principalOfficeHeaderSelector} ~ div input[name="Zip5"]`;
            const streetAddress1Value12 = payload.Principal_Address.Zip_Code; 
            // Wait for and type into the StreetAddress1 input field
            await page.waitForSelector(streetAddress1Selector2);
            await page.type(streetAddress1Selector2, streetAddress1Value12);


          // Excuter information

          // Checkbox
          // Wait for the checkbox to be available
          await page.waitForSelector('#Executor_isUserPricipal');
          await new Promise(resolve => setTimeout(resolve, 6000));
          await page.click('#Executor_isUserPricipal');
          // await page.waitForSelector('.loader', { visible: true });
          // await page.waitForSelector('.loader', { hidden: true });
          
          // button
          // Wait for the button to be available
          await page.waitForSelector('input[name="btnAddIncorporator"]');
          await new Promise(resolve => setTimeout(resolve, 6000));
          await page.click('input[name="btnAddIncorporator"]');
          // await page.waitForSelector('.loader', { visible: true });


          // Governer Information

          await page.waitForSelector('#GoverningPerson_isUserPricipal');

          // Optionally, wait for a brief delay before clicking
          await new Promise(resolve => setTimeout(resolve, 6000));
        
          // Click the checkbox using Puppeteer's built-in method
          await page.click('#GoverningPerson_isUserPricipal');



          await page.waitForSelector('input[value="Add Governor"]');
          await new Promise(resolve => setTimeout(resolve, 4000));
          await page.click('input[value="Add Governor"]');
          // await page.waitForSelector('.loader', { visible: true }); 


          // Nature of Business
          // Other
          await page.waitForSelector('#rdoOtherNAICS');
          await new Promise(resolve => setTimeout(resolve, 3000));
          await page.evaluate(() => {
            const checkbox = document.querySelector('#rdoOtherNAICS');
            if (checkbox) {
              checkbox.click();  // Click the checkbox
            }
          });

          // Other input fields
          await page.waitForSelector('#txtOtherNOBDesc');
          await new Promise(resolve => setTimeout(resolve, 3000));
          await page.type('#txtOtherNOBDesc', 'HardCoaded Field');
          await page.evaluate(() => {
            const textarea = document.querySelector('#txtOtherNOBDesc');
            if (textarea) {
              textarea.dispatchEvent(new Event('blur', { bubbles: true }));  // Trigger blur event if required
            }
          });

          // Authorized Person
          await page.waitForSelector('input[name="chkAuthorized"]');

          // Optionally, wait for a brief delay before clicking
          await new Promise(resolve => setTimeout(resolve, 3000));
        
          // Click the checkbox using Puppeteer's built-in method
          await page.click('input[name="chkAuthorized"]');


          // Checkbox

          await page.waitForSelector('input[name="isaccepted1"]');
          await new Promise(resolve => setTimeout(resolve, 3000));
          await page.click('input[name="isaccepted1"]');

          await page.waitForSelector('input[value="Continue"]');

          // Optionally, wait for a brief delay before clicking
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Click the button using Puppeteer's built-in method
          await page.click('input[value="Continue"]');
          

      } catch (error) {
          // Log full error stack for debugging
          logger.error('Error in Washington LLC form handler:', error.stack);
          throw new Error(`Washington LLC form submission failed: ${error.message}`);
        }
      }
      async function fillInputByXPath(page, xpath, value) {
        await page.waitForXPath(xpath); 
        await page.type(xpath, value);  
    }
    

module.exports = WashingtonForLLC;
