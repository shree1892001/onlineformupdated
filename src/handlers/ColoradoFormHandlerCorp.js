const BaseFormHandler = require('./BaseFormHandler');
const { waitForSelectorAndType } = require('../utils/puppeteerUtils');
const logger = require('../utils/logger');  // Import logger

class ColoradoFormHandlerCorp extends BaseFormHandler {
    async loadSelectors(stateFullDesc) {
        const stateFile = path.join(__dirname, 'properties', `${stateFullDesc.toLowerCase().replace(/ /g, '-')}_selectors.json`);
        return JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
      }
    async loadSelectors(stateFullDesc) {
        const stateFile = path.join(__dirname, 'properties', `${stateFullDesc.toLowerCase().replace(/ /g, '-')}_selectors.json`);
        return JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
      }
    async fillForm(page, data) {
        await retry(async () => {
  
            try {
              console.log("Navigating to the Landing page...");
    
    
              await page.goto(jsonData.State.stateUrl, {
                waitUntil: 'networkidle0',
                timeout: 60000
              });
              console.log('Landing Page Loaded');
            } catch (error) {
              console.error("Error navigating to the Landing page:", error.message);
              throw new Error("Navigation to the Landing page failed.");
            }
          }, 5, page);
    
          await randomSleep(3000, 5000);
          await performEventsonLandingPage(page);
    
          await adjustViewport(page);
    
          console.log("Waiting for the list to appear...");
    
          async function performEventsonLandingPage(page) {
            try {
    
              await page.waitForSelector('.w3-ulcontents');
              await page.evaluate(() => {
                const link = document.querySelector('.w3-ulcontents a[href="#Profit"]');
                if (link) {
                  link.click();
                }
              });
              await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 120000 });
              await page.waitForSelector('.w3-table.w3-cmsTable');
              await page.evaluate(() => {
                const link = document.querySelector('.w3-table.w3-cmsTable tbody tr:nth-child(1) td:nth-child(2) a');
                if (link) {
                  link.click();
                }
              });
              await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 120000 });
    
              await page.waitForSelector('input.w3-btn-next[type="button"]');
              await page.evaluate(() => {
                document.querySelector('input.w3-btn-next[type="button"]').click();
              });
              await page.waitForNavigation({ waitUntil: 'networkidle0' });
              try {
    
    
                await page.waitForSelector('#name', { timeout: 5000 });
                let legalName = data.Payload.Name.CD_Legal_Name;
                const hasErrorMessage = await page.evaluate(() => {
                    const div = document.querySelector('.w3-panel.w3-leftbar.w3-display-container.w3-pale-red.w3-border-red p');
                    return div ? div.innerText.includes('The name must include one of the terms or abbreviations exactly as listed above.') : false;
                });
            
                // Throw an error if the message is found
                if (hasErrorMessage) {
                    throw new Error('Error: The name must include one of the terms or abbreviations exactly as listed above.');
                } else {
                    console.log('No error message found.');
                }
    
                if (legalName.length > 200) {
                  throw new Error('Input exceeds the maximum length of 200 characters.');
                }
    
                if (!/^[\x00-\x7F]+$/.test(legalName)) {
                  throw new Error('Input contains non-ASCII characters.');
                }
    
                await page.type('#name', legalName, { delay: 100 });
    
                const filledValue = await page.$eval('#name', el => el.value);
                console.log('Filled input value:', filledValue);
    
    
    
              } catch (error) {
                let errorResponse = {
                  success: false,
                  error: e.message
                };
                if (e.message.includes(("The name must include one of the terms or abbreviations exactly as listed above."))) {
                  errorResponse.error = e.message;
                }
              }
              async function fillAddress(page, addressData, selectors) {
                await page.waitForSelector(selectors.Colorado.principal_address.address1);
                await page.type(selectors.Colorado.principal_address.address1, addressData.Payload.Principal_Address.PA_Address_Line1);
                await randomSleep(1000, 3000);
    
                await page.waitForSelector(selectors.Colorado.principal_address.address2);
                await page.type(selectors.Colorado.principal_address.address2, addressData.Payload.Principal_Address.PA_Address_Line2);
                await randomSleep(1000, 3000);
    
                await page.waitForSelector(selectors.Colorado.principal_address.city);
                await page.type(selectors.Colorado.principal_address.city, addressData.Payload.Principal_Address.PA_City);
                await randomSleep(1000, 3000);
    
                await page.waitForSelector(selectors.Colorado.principal_address.state);
                await page.type(selectors.Colorado.principal_address.state, addressData.Payload.Principal_Address.PA_State);
                await randomSleep(1000, 3000);
    
                await page.waitForSelector(selectors.Colorado.principal_address.zip);
    
    
                await page.evaluate(() => {
    
                  const zip = document.querySelector(selectors.Colorado.principal_address.zip);
                  zip.value = addressData.Payload.Principal_Address.PA_Zip_Code;
                })
                // await page.type(selectors.Colorado.principal_address.zip, addressData.Principal_Address.PA_Zip_Code);
                await randomSleep(1000, 3000);
    
                await page.waitForSelector(selectors.Colorado.principal_address.country);
                await page.type(selectors.Colorado.principal_address.country, addressData.Payload.Principal_Address.PA_Country);
                await randomSleep(1000, 3000);
    
                if (addressData.Payload.Incorporator_Information.Address.Inc_Address_Line1 === addressData.Payload.Principal_Address.PA_Address_Line1) {
                  await page.waitForSelector(selectors.Colorado.common_address.common);
                  console.log(selectors.Colorado.common_address.common);
                  await page.click(selectors.Colorado.common_address.common);
                  await randomSleep(1000, 3000);
                } else {
                  await fillMailingAddress(page, addressData, selectors);
                }
              }
    
              async function fillMailingAddress(page, addressData, selectors) {
                await page.waitForSelector(selectors.Colorado.mailing_address.address1);
                await page.type(selectors.Colorado.mailing_address.address1, addressData.Payload.Incorporator_Information.Address.Inc_Address_Line1);
                await randomSleep(1000, 3000);
    
                await page.waitForSelector(selectors.Colorado.mailing_address.address2);
                await page.type(selectors.Colorado.mailing_address.address2, addressData.Payload.Incorporator_Information.Address.Inc_Address_Line2);
                await randomSleep(1000, 3000);
    
                await page.waitForSelector(selectors.Colorado.mailing_address.city);
                await page.type(selectors.Colorado.mailing_address.city, addressData.Payload.Incorporator_Information.Address.Inc_City);
                await randomSleep(1000, 3000);
    
                await page.waitForSelector(selectors.Colorado.mailing_address.state);
                await page.type(selectors.Colorado.mailing_address.state, addressData.Payload.Incorporator_Information.Address.Inc_State);
                await randomSleep(1000, 3000);
    
                await page.waitForSelector(selectors.Colorado.mailing_address.zip);
                await page.type(selectors.Colorado.mailing_address.zip, addressData.Payload.Incorporator_Information.Address.Inc_Zip_Code);
                await randomSleep(1000, 3000);
    
                await page.waitForSelector(selectors.Colorado.mailing_address.country);
                await page.type(selectors.Colorado.mailing_address.country, addressData.Payload.Incorporator_Information.Address.Inc_Country);
                await randomSleep(1000, 3000);
              }
    
              if (data.Payload.Principal_Address) {
                const selectors = loadSelectors(jsonData.State.stateFullDesc);
                await fillAddress(page, data, selectors);
              }
    
              if (data.Payload.Principal_Address) {
                const selectors = loadSelectors(jsonData.State.stateFullDesc)
    
                await fillAddress(page, data, selectors)
              }
              function validateInput(value,maxL,minL) {
                const maxLength = maxL;
                const minLength = minL;
                const pattern = /^[\x00-\x7F]+$/;  // Matches ASCII characters only
            
                if (value.length > maxLength) {
                    throw new Error(`Input exceeds the maximum length of ${maxLength} characters.`);
                }
            
                if (value.length < minLength) {
                    throw new Error(`Input must be at least ${minLength} character long.`);
                }
            
                if (!pattern.test(value)) {
                    throw new Error('Input contains non-ASCII characters.');
                }
            
                return true;  // If all validations pass
            }
              
    if (data.Payload.Registered_Agent) {
    await page.waitForSelector(".w3-margin-button");
    
    // Check if the Registered Agent is an Individual
    if (data.Payload.Registered_Agent.agentType === "Individual") {
        await page.click('input[name="nameTyp"][value="I"]');
    
        await page.waitForSelector('input[name="individualName-firstName"');
        await page.evaluate((data) => {
            const firstname = data.Registered_Agent.RA_Name.split(" ")[0];
            const lastname = data.Registered_Agent.RA_Name.split(" ")[1];
    
            const legalName = document.querySelector('input[name="individualName-firstName"]');
            const legalNameSec = document.querySelector('input[name="individualName-lastName"]');
    
            if (validateInput(firstname, 20, 1) || validateInput(lastname, 25, 2)) {
                legalName.value = firstname;
                legalNameSec.value = lastname;
            }
        }, data);
    
    // Check if the Registered Agent is an Entity
    } else if (data.Payload.Registered_Agent.agentType == "Entity") {
        await page.waitForSelector('input[name="nameTyp"][value="O"]', { visible: true });
        await page.click('input[name="nameTyp"][value="O"]');
        await page.waitForSelector('input[name="orgName"]');
        await page.evaluate((data) => {
            document.querySelector('input[name="orgName"]').value = data.Registered_Agent.RA_Name;
        }, data);
    }
    
    // Fill the address form
    await fillAddressForm(page, {
        streetAddress1: data.Payload.Registered_Agent.address.streetAddress1, // Adjust these paths based on your data structure
        streetAddress2: data.Payload.Registered_Agent.address.streetAddress2,
        city: data.Payload.Registered_Agent.address.city,
        zipCode: data.Payload.Registered_Agent.address.zipCode
    });
    }
    
    // Function to handle filling the entire address form
    async function fillAddressForm(page, data) {
    // Validation rules for each input field
    const fieldRules = {
        '#streetAddress-address1': { required: true, minLength: 2, maxLength: 50, pattern: /^[\x00-\x7F]+$/ },
        '#streetAddress-address2': { required: false, minLength: 2, maxLength: 50, pattern: /^[\x00-\x7F]+$/ },  // Optional
        '#streetAddress-city': { required: true, minLength: 2, maxLength: 35, pattern: /^[\x00-\x7F]+$/ },
        '#streetAddress-zip': { required: true, minLength: 2, maxLength: 15, pattern: /^[\x00-\x7F]+$/ }
    };
    
    // Validate and fill Address 1 (required)
    await validateAndFillField(page, '#streetAddress-address1', data.streetAddress1, fieldRules['#streetAddress-address1']);
    
    // Validate and fill Address 2 (optional)
    await validateAndFillField(page, '#streetAddress-address2', data.streetAddress2, fieldRules['#streetAddress-address2']);
    
    // Validate and fill City (required)
    await validateAndFillField(page, '#streetAddress-city', data.city, fieldRules['#streetAddress-city']);
    
    // Log the State since it's predefined as "CO"
    console.log('State: CO (predefined)');
    
    // Validate and fill ZIP Code (required)
    await validateAndFillField(page, '#streetAddress-zip', data.zipCode, fieldRules['#streetAddress-zip']);
    }
    
    // Generic function to validate and fill a field based on JSON data
    async function validateAndFillField(page, selector, value, { minLength, maxLength, pattern, required }) {
    // Check if the field is required and the value is empty
    if (required && !value) {
        throw new Error(`The field '${selector}' is required but no value was provided.`);
    }
    
    // If the field is optional and value is empty, skip the validation and input
    if (!required && !value) {
        console.log(`Optional field '${selector}' is not provided, skipping.`);
        return;
    }
    
    // Validate the input based on the provided rules
    if (value.length > maxLength) {
        throw new Error(`Input for field '${selector}' exceeds the maximum length of ${maxLength} characters.`);
    }
    
    if (value.length < minLength) {
        throw new Error(`Input for field '${selector}' must be at least ${minLength} characters long.`);
    }
    
    if (!pattern.test(value)) {
        throw new Error(`Input for field '${selector}' contains invalid characters (non-ASCII).`);
    }
    
    // Fill the field with the validated value
    await page.type(selector, value);
    
    
    
    console.log(`Successfully filled field: ${selector}`);
    }
  
    await page.waitForSelector('input[name="agentConsentRadio"]');
    await page.evalute(()=>{
  
      const btn=document.querySelector('input[name="agentConsentRadio"][value="Y"]');
      btn.click();
    })
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 120000 });
  
    // Check for error messages after navigation
    const alertSelector = '.w3-modal';
    const errorMessage = 'Address must be in Colorado.';
  
    const alertVisible = await page.evaluate((alertSelector) => {
      const alert = document.querySelector(alertSelector);
      if(alert){
      const btn=document.querySelector("button.w3-btn-cancel");
      if(btn){
          btn.click();
      }
      }
      return alert ;
    }, alertSelector);
  await page.waitForSelector('input[name="managedBy"]');
  
      await page.evaluate((data) => {
          const managedByRadio = document.querySelector(`input[name="managedBy"][value="${data.Payload.Memeber_Or_Manager.Mom_Memeber_Or_Manager}"]`);
          if (managedByRadio) {
              managedByRadio.click();
          }
      }, data);
  
      await page.waitForSelector('input[name="hasOneMember"]');
  
      await page.evaluate((data) => {
          const hasOneMemberRadio = document.querySelector(`input[name="hasOneMember"][value="${data.Payload.Memeber_Or_Manager.Mom_Memeber_Or_Manager}"]`);
          if (hasOneMemberRadio) {
              hasOneMemberRadio.click();
          }
      }, data);
  
      await page.waitForSelector('.w3-margin-bottom', { visible: true,timeout:120000 });
  
      if(data.Payload.Organizer_Information){
    
         
      }
      if(data.Payload.EffectiveDate){
  
        await page.waitForSelector('input[name="dedSelectRadio"][value="Y"]',{visible:true ,timeout:120000} ); 
  
        await page.click('input[name="dedSelectRadio"][value="Y"]'); 
      }
      await page.waitForSelector('input[name="perjuryNoticeAffirmed"]',{visible:true, timeout:12000}); 
      await page.click('input[name="perjuryNoticeAffirmed"]'); 
  
      await page.waitForSelector('input[name="sameAsFormer"]',{visible:true,timeout:10000}); 
      if(data.Payload.Organizer_Information === data.Payload.Filer_Information){
      await page.click('input[name="sameAsFormer"]'); 
      }else{
          //  let firstName= data.Payload.Organizer_Information.Organizer_Details.Org_Name.split(" ")[0]; 
          //  let lastName=data.Payload.Organizer_Information.Organizer_Details.Org_Name.split(" ")[1]; 
          //  await page.waitForSelector("#name-firstName",{visible:true,timeout:120000});
          //  await page.evaluate((firstName,lastName)=>{
  
          //      const fname=document.querySelector('#name-firstName'); 
          //      fname.value=firstName; 
  
          //      const sname=document.querySelector('#name-lastName'); 
          //      sname.value=lastName; 
          //  },firstName,lastName); 
          try {
            await page.waitForSelector("#name-firstName", { visible: true, timeout: 120000 });
        
            // Use page.evaluate to handle the form filling and dropdown selection in one go
            await page.evaluate((data) => {
                // Extract first and last names
                const firstName = data.Payload.Organizer_Information.Organizer_Details.Org_Name.split(" ")[0]; 
                const lastName = data.Payload.Organizer_Information.Organizer_Details.Org_Name.split(" ")[1]; 
        
                // Fill in First Name and validate
                const fname = document.querySelector('#name-firstName'); 
                fname.value = firstName; 
                if (fname.value.length < 2 || fname.value.length > 35 || !/[\x00-\x7F]+/.test(fname.value)) {
                    throw new Error('First Name validation failed.');
                }
        
                // Fill in Last Name and validate
                const lname = document.querySelector('#name-lastName'); 
                lname.value = lastName;
                if (lname.value.length < 2 || lname.value.length > 35 || !/[\x00-\x7F]+/.test(lname.value)) {
                    throw new Error('Last Name validation failed.');
                }
        
                // Fill in Address 1 and validate
                const address1 = data.Payload.Organizer_Information.Org_Address.Org_Address_Line1;
                const addressField1 = document.querySelector('#address-address1');
                addressField1.value = address1;
                if (addressField1.value.length < 2 || addressField1.value.length > 50 || !/[\x00-\x7F]+/.test(addressField1.value)) {
                    throw new Error('Address 1 validation failed.');
                }
        
                // Fill in Address 2 (optional)
                
        
                // Fill in City and validate
                const city = data.Payload.Organizer_Information.Org_Address.Org_City; 
                const cityField = document.querySelector('#address-city');
                cityField.value = city;
                if (cityField.value.length < 2 || cityField.value.length > 35 || !/[\x00-\x7F]+/.test(cityField.value)) {
                    throw new Error('City validation failed.');
                }
        
                // Select State from dropdown
                const stateDropdown = document.querySelector('#address-state');
                const stateOption = Array.from(stateDropdown.options).find(opt => opt.text.trim() === data.Payload.Organizer_Information.Org_Address.Org_State); // Example: NY
                if (stateOption) {
                    stateDropdown.value = stateOption.value;
                    stateDropdown.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    throw new Error('State selection failed.');
                }
        
                // Validate State (already selected through selectOptionByText)
                if (!stateDropdown.value) {
                    throw new Error('State must be selected.');
                }
        
                // Fill in ZIP Code and validate
                const zip = data.Payload.Organizer_Information.Org_Address.Org_Zip_Code; // Example ZIP code
                const zipField = document.querySelector('#address-zip');
                zipField.value = zip;
                if (zipField.value.length < 2 || zipField.value.length > 15 || !/[\x00-\x7F]+/.test(zipField.value)) {
                    throw new Error('ZIP Code validation failed.');
                }
        
                // Fill in Province (optional)
                const provinceField = document.querySelector('#address-province');
                provinceField.value = data.Payload.Organizer_Information.Org_Address.Org_State; // Optional
        
                // Select Country from dropdown
                const countryDropdown = document.querySelector('#address-country');
                const countryOption = Array.from(countryDropdown.options).find(opt => opt.text.trim() === 'US');
                if (countryOption) {
                    countryDropdown.value = countryOption.value;
                    countryDropdown.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    throw new Error('Country selection failed.');
                }
        
                // Validate Country
                if (!countryDropdown.value) {
                    throw new Error('Country must be selected.');
                }
        
                // Click the submit button
                const submitButton = document.querySelector('#submit-button');
                if (submitButton) {
                    submitButton.click();
                } else {
                    throw new Error('Submit button not found.');
                }
            }, data);
        
            // Wait for form submission or page navigation
            await page.waitForNavigation({waitUntil:'networkidle0'});
            console.log('Form submitted successfully!');
        } catch (error) {
            console.error('Error:', error.message);
        } 
        await page.evaluate((data) => {
          const emailYes = document.querySelector('input[name="emailNotificationRadio"][value="Y"]');
          const emailNo = document.querySelector('input[name="emailNotificationRadio"][value="N"]');
          
          if (data.Payload.Notification_Information.Notification_Details.Email=== 'Y') {
            emailYes.checked = true;
            emailYes.dispatchEvent(new Event('change', { bubbles: true }));
            emailYes.dispatchEvent(new Event('change', { bubbles: true }));
  
        // Email input fields for sending notifications
        const emailInput = document.querySelector('#emailId');
        const retypeEmailInput = document.querySelector('#reTypeEmailId');
  
        // Set values for email and retype email fields
        emailInput.value = data.Payload.Organizer_Information.Organizer_Details.Org_Email_Address;
        retypeEmailInput.value = data.Payload.Organizer_Information.Organizer_Details.Org_Email_Address;
  
        // Validation logic based on the HTML attributes
        const emailPattern = /^[\x00-\x7F]+$/;
        if (!emailInput.required || !retypeEmailInput.required) {
          throw new Error("Both email fields are required.");
        }
        if (email.length > 150 || verifyEmail.length > 150) {
          throw new Error("Email exceeds the maximum length of 150 characters.");
        }
        if (!emailPattern.test(email) || !emailPattern.test(verifyEmail)) {
          throw new Error("Email does not match the required pattern.");
        }
        if (email !== verifyEmail) {
          throw new Error("The emails do not match.");
        }
  
        // Trigger validation events
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        retypeEmailInput.dispatchEvent(new Event('input', { bubbles: true }));
  
      }  else if (data.Payload.Notification_Information.Notification_Details.Email === 'N') {
            emailNo.checked = true;
            emailNo.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, data);
      
        // Handle text notification radio button
        await page.evaluate((data) => {
          const textYes = document.querySelector('input[name="textNotificationRadio"][value="Y"]');
          const textNo = document.querySelector('input[name="textNotificationRadio"][value="N"]');
          
          if (data.Payload.Notification_Information.Notification_Details.Text === 'Y') {
            textYes.checked = true;
            const areaCodeInput = document.querySelector('#textAreaCodeId');
            const middleThreeInput = document.querySelector('#textThree');
            const lastFourInput = document.querySelector('#textFourId');
        
            // Function to extract phone number parts
            const phonePattern = /^\((\d{3})\)\s(\d{3})-(\d{4})$/;
            const match = phonePattern.exec(data.Payload.Organizer_Information.Organizer_Details.Org_Contact_No);
        
            if (!match) {
              throw new Error("Invalid phone number format. Expected format: (555) 123-4567.");
            }
        
            const areaCode = match[1];       // First three digits (Area code)
            const middleThree = match[2];    // Middle three digits
            const lastFour = match[3];       // Last four digits
        
            // Set the values of the input fields
            areaCodeInput.value = areaCode;
            middleThreeInput.value = middleThree;
            lastFourInput.value = lastFour;
        
            // Validation patterns
            const areaCodePattern = /^\d{3}$/; // Matches exactly 3 digits
            const middleThreePattern = /^\d{3}$/; // Matches exactly 3 digits
            const lastFourPattern = /^\d{4}$/; // Matches exactly 4 digits
        
            // Perform validations
            if (!areaCodePattern.test(areaCode)) {
              throw new Error("The area code must be exactly 3 numeric digits.");
            }
            if (!middleThreePattern.test(middleThree)) {
              throw new Error("The middle part of the phone number must be exactly 3 numeric digits.");
            }
            if (!lastFourPattern.test(lastFour)) {
              throw new Error("The last part of the phone number must be exactly 4 numeric digits.");
            }
        
            // Dispatch 'input' events to simulate user input
            areaCodeInput.dispatchEvent(new Event('input', { bubbles: true }));
            middleThreeInput.dispatchEvent(new Event('input', { bubbles: true }));
            lastFourInput.dispatchEvent(new Event('input', { bubbles: true }));
        
          
            textYes.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (data.Payload.Notification_Information.Notification_Details.Text === 'N') {
            textNo.checked = true;
            textNo.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, data);
  
        
      }
    }
        catch (e) {
            let errorResponse = {
              success: false,
              error: e.message
            };
            if (e.message.includes('Execution context was destroyed')) {
              errorResponse.error = "Error: Execution context was destroyed, possibly due to page navigation.";
            } else if (e.message.includes('Address is more than 50 characte')) {
              errorResponse.error = e.message;
            }
          };
        } 
}
    
}


module.exports = ColoradoFormHandlerLLC;
