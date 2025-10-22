import { test, expect, Page } from '@playwright/test';

/**
 * Test Case: TC 001 - Verify that user can register a new customer
 * This test implements the requirements from TestSuite.md
 */

test.describe('ParaBank User Registration Tests', () => {

    test('TC 001 - Verify that user can register a new customer', async ({ page }: { page: Page }) => {
        console.log('🧪 Starting TC 001: User Registration Test');
        
        try {
            // Step 1: Navigate to ParaBank homepage
            console.log('📍 Step 1: Navigate to ParaBank homepage');
            await page.goto('https://parabank.parasoft.com/parabank/index.htm');
            await page.waitForLoadState('networkidle');
            
            // Verify homepage loaded
            await expect(page).toHaveTitle(/ParaBank.*Welcome.*Online Banking/);
            console.log('✅ Step 1: Successfully navigated to ParaBank homepage');

            // Step 2: Click on the Register link
            console.log('📍 Step 2: Click Register link');
            const registerLink = page.getByRole('link', { name: 'Register' });
            await registerLink.waitFor({ state: 'visible' });
            await registerLink.click();
            await page.waitForLoadState('networkidle');
            
            // Verify registration page loaded
            await expect(page).toHaveTitle(/ParaBank.*Register/);
            console.log('✅ Step 2: Successfully clicked Register link');

            // Step 3: Fill the registration form with unique data
            console.log('📍 Step 3: Fill registration form');
            
            // Generate unique 10-character username
            const timestamp = Date.now().toString();
            const username = 'test' + timestamp.slice(-6); // Ensures exactly 10 characters
            const password = 'SecurePass123!';
            
            // Fill form fields
            await page.locator('input[id="customer.firstName"]').fill('John');
            await page.locator('input[id="customer.lastName"]').fill('Doe');
            await page.locator('input[id="customer.address.street"]').fill('123 Main St');
            await page.locator('input[id="customer.address.city"]').fill('New York');
            await page.locator('input[id="customer.address.state"]').fill('NY');
            await page.locator('input[id="customer.address.zipCode"]').fill('10001');
            await page.locator('input[id="customer.phoneNumber"]').fill('555-123-4567');
            await page.locator('input[id="customer.ssn"]').fill('123-45-6789');
            await page.locator('input[id="customer.username"]').fill(username);
            await page.locator('input[id="customer.password"]').fill(password);
            await page.locator('input[id="repeatedPassword"]').fill(password);
            
            console.log(`✅ Step 3: Filled form with username: ${username} (${username.length} characters)`);

            // Step 4: Submit the form
            console.log('📍 Step 4: Submit registration form');
            const registerButton = page.locator('input[value="Register"]');
            await registerButton.click();
            await page.waitForLoadState('networkidle');
            console.log('✅ Step 4: Successfully submitted form');

            // Step 5: Verify welcome message with username
            console.log('📍 Step 5: Verify welcome message');
            
            // Check page title changed to Customer Created
            await expect(page).toHaveTitle(/Customer Created/);
            
            // Check welcome message contains username
            const welcomeHeading = page.locator('h1.title');
            await expect(welcomeHeading).toContainText(username);
            
            // Check confirmation message
            const confirmationMessage = page.locator('p', { hasText: 'Your account was created successfully' });
            await expect(confirmationMessage).toBeVisible();
            
            // Check left panel shows user name
            const leftPanelWelcome = page.locator('div.leftpanel p').first();
            await expect(leftPanelWelcome).toContainText('Welcome John Doe');
            
            console.log(`✅ Step 5: Successfully verified welcome message for user: ${username}`);
            console.log('🎉 TC 001 PASSED: User registration completed successfully');

        } catch (error: any) {
            console.log(`❌ TC 001 FAILED: ${error.message}`);
            
            // Take screenshot on failure
            await page.screenshot({ 
                path: `reports/screenshots/TC001_FAILED_${Date.now()}.png`,
                fullPage: true 
            });
            
            throw error;
        }
    });
});