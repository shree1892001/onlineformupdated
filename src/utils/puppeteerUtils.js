const logger = require('./logger');  // Import logger
async function navigateToPage(page, url) {
    try {
        // Retry navigation to the provided URL up to 3 times
        const response = await retry(async () => {
            return await page.goto(url, {
                waitUntil: 'networkidle0', // Wait until there are no more than 0 network connections for 500ms
                timeout: 60000 // Timeout after 60 seconds
            });
        }, 5); // Retry 3 times before throwing an error

        // Check if the page loaded successfully, otherwise refresh
        if (!response || response.status() !== 200) {
            logger.warn('Page not reached, refreshing...');
            await refreshPage(page, url);
        } else {
            logger.info('Page loaded successfully.');
        }
    } catch (error) {
        logger.error(`Failed to navigate to page: ${error.message}`);
        throw error;
    }
}
exports.waitForSelectorAndType = async (page, selector, text) => {
    logger.info(`Typing into selector: ${selector}`);
    await page.waitForSelector(selector);
    await page.type(selector, text);
};

async function randomSleep(min = 1000, max = 1000) {
    const sleepTime = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, sleepTime));
}

async function addInput(page, inputFields) {
    try {
        logger.info("Attempting dynamic input...");

        // Find and print all existing input fields on the page
        const inputElements = await page.$$eval('input', inputs =>
            inputs.map(input => ({
                name: input.name || '',
                id: input.id || '',
                class: input.className || '',
                label: input.labels ? (input.labels[0] ? input.labels[0].innerText : '') : ''
            }))
        );

        logger.info("Existing input fields on the page:", inputElements);

        // Iterate over inputFields and try to fill them
        for (let field of inputFields) {
            const { selector, value, label } = field;

            if (label) {
                // Handle input based on label
                const inputSelector = await getInputSelectorByLabel(page, label);

                if (inputSelector) {
                    logger.info(`Found input for label "${label}", filling value...`);
                    await page.waitForSelector(inputSelector, { visible: true, timeout: 110000 });
                    await page.type(inputSelector, value, { delay: 100 });
                } else {
                    logger.error(`Could not find input field for label "${label}"`);
                    throw new Error(`Label "${label}" not found`);
                }
            } else {
                // Handle input fields using direct selectors
                logger.info(`Filling input field for selector "${selector}"...`);
                await page.waitForSelector(selector, { visible: true, timeout: 110000 });
                await page.type(selector, value, { delay: 100 });
            }
        }
    } catch (error) {
        logger.error("Failed to fill input field:", error.message);
        throw error; // Re-throw error after logging
    }
}


// Helper function to get input selector by label text
async function getInputSelectorByLabel(page, labelText) {
    try {
        // Find and log all existing labels on the page
        const existingLabels = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('label')).map(label => label.textContent.trim());
        });

        console.log("Existing labels on the page:", existingLabels);

        // Attempt to find the label element first
        const inputId = await page.evaluate((labelText) => {
            const label = Array.from(document.querySelectorAll('label')).find(
                el => el.textContent.trim().includes(labelText)
            );

            // If found, return the 'for' attribute
            return label ? label.getAttribute('for') : null;
        }, labelText);

        // If a 'for' attribute is found, return the selector
        if (inputId) {
            return `#${inputId}`;
        } else {
            console.error(`No 'for' attribute found for label "${labelText}"`);
            // Attempt to use the label text directly to find the input by ID
            return `#${labelText}`;
        }
    } catch (error) {
        console.error("Error finding input selector by label:", error);
    }

    return null;
}

async function clickLinkByLabel(page, label, maxRetries = 3) {
    let retries = 0;

    while (retries < maxRetries) {
        try {
            console.log(`Waiting for the list with links to appear...`);

            // Wait for the list of links to appear
            await page.waitForSelector('ul.t-LinksList', { visible: true, timeout: 60000 });

            console.log(`Searching for the link with label: "${label}"`);

            // Find the link with the matching label text
            const linkUrl = await page.evaluate((label) => {
                const links = document.querySelectorAll('ul.t-LinksList li.t-LinksList-item a.t-LinksList-link');
                for (let link of links) {
                    const linkLabel = link.querySelector('.t-LinksList-label');
                    if (linkLabel && linkLabel.textContent.trim() === label) {
                        return link.getAttribute('href');  // Return the href attribute of the matching link
                    }
                }
                return null;
            }, label);

            if (!linkUrl) {
                throw new Error(`Couldn't find the link with label "${label}".`);
            }

            console.log(`Found link for "${label}". Navigating to: ${linkUrl}`);

            // Navigate to the found link's URL
            await page.goto(new URL(linkUrl, page.url()).href, { waitUntil: 'networkidle0', timeout: 60000 });

            console.log(`Successfully navigated to the page for "${label}".`);

            // Optional: small delay after navigation
            return;  // Success, exit the function

        } catch (error) {
            retries += 1;
            console.error(`Error on attempt ${retries} when clicking on the link with label "${label}":`, error.message);

            // Handle specific network errors like ERR_CONNECTION_RESET or Timeout
            if (error.message.includes('ERR_CONNECTION_RESET') || error.message.includes('Timeout')) {
                console.error('Network error encountered. Retrying...');


                if (retries === maxRetries) {
                    console.error(`Max retries reached. Unable to click on the link with label "${label}".`);
                    return;
                }
            } else {
                // If it's another type of error, rethrow it
                throw error;
            }
        }
    }
}

async function selectCheckboxByLabel(page, checkboxText) {
    try {
        // Wait for the checkbox input to be visible
        await page.waitForSelector('input[type="checkbox"]', { visible: true, timeout: 30000 });

        // Get all checkbox inputs within the document
        const checkboxes = await page.$$('input[type="checkbox"]');

        for (const checkbox of checkboxes) {
            // Find the parent <p> element of the checkbox
            const parentP = await page.evaluateHandle(el => el.closest('p'), checkbox);

            // Get the text content of the <p> element
            const paragraphText = await page.evaluate(el => el.textContent.trim(), parentP);

            // Use case-insensitive matching
            if (paragraphText.toLowerCase().includes(checkboxText.toLowerCase())) {
                // Scroll the checkbox into view
                await page.evaluate(el => {
                    el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
                }, checkbox);

                // Click the checkbox directly
                await checkbox.click();
                console.log(`Attempted to select checkbox with text: "${paragraphText}"`);

                // Check if the checkbox is selected
                let isChecked = await page.evaluate(el => el.checked, checkbox);

                // Retry clicking if not checked
                let attempts = 0;
                while (!isChecked && attempts < 3) {
                    await checkbox.click(); // Try clicking again
                    console.log(`Retrying click for checkbox with text: "${paragraphText}"`);

                    // Check again if the checkbox is selected
                    isChecked = await page.evaluate(el => el.checked, checkbox);
                    attempts++;
                }

                if (isChecked) {
                    console.log(`Successfully selected checkbox with text: "${paragraphText}"`);
                } else {
                    console.log(`Failed to select checkbox with text: "${paragraphText}" after multiple attempts.`);
                }

                return; // Exit after processing the correct checkbox
            }
        }

        console.log(`Checkbox with text "${checkboxText}" not found.`);
    } catch (error) {
        console.error("Error selecting checkbox:", error);
    }
}

async function submitForm(page, buttonSelectors = ['button[type="submit"]', 'button.t-Button--hot', 'button#P101_LOGIN','t-Button t-Button--hot'],) {
    try {
        // Retry form submission up to 3 times in case of failure
        await retry(async () => {
            await page.evaluate((buttonSelectors) => {
                // Try to find the submit button dynamically using the provided selectors
                let submitButton;
                for (const selector of buttonSelectors) {
                    submitButton = document.querySelector(selector);
                    if (submitButton) {
                        // Log button details (id and class)
                        console.log(`Found submit button with selector: ${selector}`);
                        console.log(`Button ID: ${submitButton.id || 'No ID'}`);
                        console.log(`Button Class: ${submitButton.className || 'No Class'}`);
                        break;
                    }
                }

                if (typeof apex !== 'undefined' && typeof apex.submit === 'function') {
                    // Use apex.submit if available
                    apex.submit({ request: 'LOGIN', validate: true });
                    console.log('Used apex.submit for form submission');
                } else if (submitButton) {
                    // Fallback to clicking the submit button
                    submitButton.click();
                    console.log('Clicked the submit button for form submission');
                } else {
                    throw new Error('Submit method or button not found');
                }
            }, buttonSelectors);
        }, 3); // Retry up to 3 times

        logger.info('Form submission succeeded');

    } catch (error) {
        logger.error('Form submission failed:', error.message);
        throw error; // Re-throw the error after logging it
    }
}
async function clickDropdown(page, selector) {
    try {
        // Wait for the dropdown element to be visible
        await page.waitForSelector(selector, { visible: true, timeout: 60000 });

        // Click the dropdown to expand the options
        await page.click(selector);

        logger.info('Dropdown clicked successfully');
    } catch (error) {
        logger.error(`Failed to click the dropdown: ${error.message}`);
        throw error;
    }
}
async function clickButton(page, buttonSelector, waitForSelector = true, options = { timeout: 60000, visible: true }) {
    try {
        if (waitForSelector) {
            // Wait for the button to be visible
            await page.waitForSelector(buttonSelector, options);
        }
        // Click the button
        await page.click(buttonSelector);
        console.log(`Clicked button: ${buttonSelector}`);
    } catch (error) {
        console.error(`Error clicking button ${buttonSelector}:`, error);
        throw error; // Re-throw error after logging
    }
}
async function retry(fn, retries = 3, page) {
    for (let i = 0; i < retries; i++) {
    try {
        return await fn();
    } catch (error) {
        if (isNetworkError(error)) {
        console.error(`Network error occured : ${error.message} ...Error reloading the script `)
        await page.reload({ waitUntil: 'networkidle0' })
        }
        if (i === retries - 1) throw error;
    }
    }
}
function waitForTimeout(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}



module.exports = {clickButton,clickDropdown,navigateToPage,selectCheckboxByLabel,submitForm,randomSleep,addInput,clickLinkByLabel};
  
  
  
  
  