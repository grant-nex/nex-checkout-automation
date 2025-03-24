const puppeteer = require('puppeteer');
const fs = require('fs');
const yaml = require('js-yaml');

// Load user information from the YAML file
const config = yaml.load(fs.readFileSync('config.yaml', 'utf8'));
const groups = config.groups;
const delay = config.delay;



(async () => {
  const browser = await puppeteer.launch({
    headless: config.headless, // Set to false to see the browser in action
    defaultViewport: null, // Set the default viewport
  });

  for (const group of groups) {
    console.log(`Running test cases for group: ${group.name}`);
    for (const user of group.users) {
      const page = await browser.newPage();

      try {
        const stripeCheckoutUrl = group.paymentLink;

        // Navigate to the Stripe Checkout page
        await page.goto(stripeCheckoutUrl);

        // Wait for the email field and type in the email
        await page.waitForSelector('#email');
        await page.type('#email', user.email, { delay });

        await page.waitForSelector('.LinkActionButton');
        await page.click('.LinkActionButton');

        // Press tab
        await page.keyboard.press('Tab');

        // Press space bar
        await page.keyboard.press('Space');

        // Wait for 5 seconds
        
        // Fill in card details
        await page.waitForSelector('#cardNumber');
        await page.type('#cardNumber', user.cardNumber, { delay });
        await page.type('#cardExpiry', user.cardExpiry, { delay });
        await page.type('#cardCvc', user.cardCvc, { delay });
        await page.type('#billingName', user.billingName, { delay });
        await page.type('#billingAddressLine1', user.billingAddressLine1, { delay });
        await page.type('#billingLocality', user.billingLocality, { delay });
        await page.type('#billingPostalCode', user.billingPostalCode, { delay });

        // Press tab
        await page.keyboard.press('Tab');

        


        // Click the "Subscribe" or "Pay" button
        await page.waitForSelector('button[type="submit"]');

        await page.waitForSelector('.SubmitButton--complete')

        // wait for submit button to be enabled
        // await page.waitForFunction(() => !document.querySelector('button[type="submit"]').disabled);

        // check if screenshots/${group.name} exists, if not create it
        if (!fs.existsSync(`screenshots/${group.name}`)) {
          fs.mkdirSync(`screenshots/${group.name}`);
        }
        
        await new Promise((r) => setTimeout(r, 1000));
        await page.screenshot({
          path: `screenshots/${group.name}/stripe-checkout-${group.name}-${user.billingPostalCode}-${user.state}.png`,
        });

        

        if (group.checkout == true) {
          await page.click('button[type="submit"]');
          

          // Wait for the success message
          await page.waitForSelector('.PaymentSuccess');
          const successMessage = await page.$eval('.PaymentSuccess', (el) => el.textContent);

          await page.waitForSelector('.PaymentSuccess-content');
          console.log(`Success for ${user.email}:`, successMessage);
          await new Promise((r) => setTimeout(r, 500));

          // Take screenshot
          await page.screenshot({
            path: `screenshots/${group.name}/stripe-checkout-success-${group.name}-${user.billingPostalCode}-${user.state}.png`,
          });
        }

        console.log(
          `Stripe Checkout automation completed successfully for ${user.email} in group: ${group.name}, postal code: ${user.billingPostalCode} state: ${user.state}!`
        );
      } catch (error) {
        console.error(`Automation failed for ${user.email} in group: ${group.name}:`, error);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
})();