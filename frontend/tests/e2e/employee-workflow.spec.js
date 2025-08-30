import { test, expect } from '@playwright/test';

test.describe('Employee Management Workflow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete employee lifecycle workflow', async ({ page }) => {
    // Step 1: Navigate to Employees page
    // Open drawer if on mobile
    if (await page.locator('[aria-label="open drawer"]').isVisible()) {
      await page.click('[aria-label="open drawer"]');
    }
  await expect(page.getByRole('button', { name: 'Employees' })).toBeVisible();
    await page.click('role=button[name="Employees"]');
    await page.waitForURL('**/employees', { timeout: 5000 });
    await page.waitForSelector('[data-testid="heading-employees"]', { timeout: 5000 });
    
    // Step 2: Add a new employee
    await page.click('button:has-text("Add Employee")');
    
    // Fill employee form
    await page.waitForSelector('input[name="name"]', { timeout: 5000 });
    await page.fill('input[name="name"]', 'John Doe');
    await page.click('button:has-text("Save")');
    
    // Verify employee was created
    await expect(page.locator('text=John Doe')).toBeVisible();
    
    // Step 3: Navigate to Timesheets
      await expect(page.locator('[data-testid="nav-timesheets"]:visible')).toBeVisible();
      await page.click('[data-testid="nav-timesheets"]:visible');
    await expect(page).toHaveURL('/timesheets');
    
    // Step 4: Clock in the employee
    await page.waitForSelector('select[name="employeeId"]', { timeout: 5000 });
    await page.selectOption('select[name="employeeId"]', 'John Doe');
    await page.click('button:has-text("Clock In")');
    
    // Verify clock in success
    await expect(page.locator('text=Successfully clocked in')).toBeVisible();
    
    // Step 5: Clock out the employee
    await page.waitForSelector('select[name="employeeId"]', { timeout: 5000 });
    await page.selectOption('select[name="employeeId"]', 'John Doe');
    await page.click('button:has-text("Clock Out")');
    
    // Verify clock out success
    await expect(page.locator('text=Successfully clocked out')).toBeVisible();
    
    // Step 6: Navigate to Payroll
      await expect(page.locator('[data-testid="nav-payroll"]:visible')).toBeVisible();
      await page.click('[data-testid="nav-payroll"]:visible');
    await expect(page).toHaveURL('/payroll');
    
    // Step 7: View employee payroll
    await page.selectOption('select[name="employeeId"]', 'John Doe');
    await page.click('button:has-text("Calculate Payroll")');
    
    // Verify payroll calculation
    await expect(page.locator('text=Total Hours')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('timesheet validation and error handling', async ({ page }) => {
    // Open drawer if on mobile
    if (await page.locator('[aria-label="open drawer"]').isVisible()) {
      await page.click('[aria-label="open drawer"]');
    }
  await expect(page.getByRole('button', { name: 'Timesheets' })).toBeVisible();
  await page.click('role=button[name="Timesheets"]');
    
    // Try to clock out without clocking in first
    await page.waitForSelector('select[name="employeeId"]', { timeout: 5000 });
    await page.selectOption('select[name="employeeId"]', 'John Doe');
    await page.click('button:has-text("Clock Out")');
    
    // Should show error message
    await expect(page.locator('text=No active timesheet found')).toBeVisible();
  });

  test('broker integration verification', async ({ page }) => {
    // Open drawer if on mobile
    if (await page.locator('[aria-label="open drawer"]').isVisible()) {
      await page.click('[aria-label="open drawer"]');
    }
  await expect(page.getByRole('button', { name: 'Broker Status' })).toBeVisible();
  await page.click('role=button[name="Broker Status"]');
    await expect(page).toHaveURL('/broker');
    
    // Check broker connection status using data-testid selector
    await page.waitForSelector('[data-testid="heading-broker-status"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="heading-broker-status"]')).toBeVisible();
    
  // Send test message
  await page.click('button:has-text("Send Message")');
    
    // Verify message was sent
    await expect(page.locator('text=Message sent successfully')).toBeVisible();
  });

  test('data persistence across page navigation', async ({ page }) => {
    // Add employee
    // Open drawer if on mobile
    if (await page.locator('[aria-label="open drawer"]').isVisible()) {
      await page.click('[aria-label="open drawer"]');
    }
  await expect(page.getByRole('button', { name: 'Employees' })).toBeVisible();
  await page.click('role=button[name="Employees"]');
    await page.click('button:has-text("Add Employee")');
    await page.waitForSelector('input[name="name"]', { timeout: 5000 });
    await page.fill('input[name="name"]', 'Jane Smith');
    await page.click('button:has-text("Save")');
    
    // Navigate away and back
    await expect(page.locator('[data-testid="nav-dashboard"]:visible')).toBeVisible();
    await page.click('[data-testid="nav-dashboard"]:visible');
    await expect(page.locator('[data-testid="nav-employees"]:visible')).toBeVisible();
    await page.click('[data-testid="nav-employees"]:visible');
    
    // Verify employee still exists
    await expect(page.locator('text=Jane Smith')).toBeVisible();
  });

  test('mobile responsiveness for employee workflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate using mobile menu
    await page.click('[aria-label="open drawer"]');
    await expect(page.locator('[data-testid="nav-employees"]:visible')).toBeVisible();
    await page.click('[data-testid="nav-employees"]:visible');
    
    // Verify mobile layout
    // Verify mobile layout using data-testid selector
    await page.waitForSelector('[data-testid="heading-employees"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="heading-employees"]')).toBeVisible();
    
    // Test mobile form interaction
    await page.click('button:has-text("Add Employee")');
    try {
      await page.waitForSelector('input[name="name"]', { timeout: 5000 });
    } catch (e) {
      console.log('DEBUG: Employee form not found (mobile test). Page HTML:');
      console.log(await page.content());
      throw e;
    }
    await page.fill('input[name="name"]', 'Mobile User');
    await page.click('button:has-text("Save")');
    
    // Verify success on mobile
    await expect(page.locator('text=Mobile User')).toBeVisible();
  });
});
