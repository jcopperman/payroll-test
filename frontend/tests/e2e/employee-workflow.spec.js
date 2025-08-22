import { test, expect } from '@playwright/test';

test.describe('Employee Management Workflow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete employee lifecycle workflow', async ({ page }) => {
    // Step 1: Navigate to Employees page
    await page.click('text=Employees');
    await expect(page).toHaveURL('/employees');
    
    // Step 2: Add a new employee
    await page.click('button:has-text("Add Employee")');
    
    // Fill employee form
    await page.fill('input[name="name"]', 'John Doe');
    await page.click('button:has-text("Save")');
    
    // Verify employee was created
    await expect(page.locator('text=John Doe')).toBeVisible();
    
    // Step 3: Navigate to Timesheets
    await page.click('text=Timesheets');
    await expect(page).toHaveURL('/timesheets');
    
    // Step 4: Clock in the employee
    await page.selectOption('select[name="employeeId"]', 'John Doe');
    await page.click('button:has-text("Clock In")');
    
    // Verify clock in success
    await expect(page.locator('text=Successfully clocked in')).toBeVisible();
    
    // Step 5: Clock out the employee
    await page.selectOption('select[name="employeeId"]', 'John Doe');
    await page.click('button:has-text("Clock Out")');
    
    // Verify clock out success
    await expect(page.locator('text=Successfully clocked out')).toBeVisible();
    
    // Step 6: Navigate to Payroll
    await page.click('text=Payroll');
    await expect(page).toHaveURL('/payroll');
    
    // Step 7: View employee payroll
    await page.selectOption('select[name="employeeId"]', 'John Doe');
    await page.click('button:has-text("Calculate Payroll")');
    
    // Verify payroll calculation
    await expect(page.locator('text=Total Hours')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('timesheet validation and error handling', async ({ page }) => {
    await page.click('text=Timesheets');
    
    // Try to clock out without clocking in first
    await page.selectOption('select[name="employeeId"]', 'John Doe');
    await page.click('button:has-text("Clock Out")');
    
    // Should show error message
    await expect(page.locator('text=No active timesheet found')).toBeVisible();
  });

  test('broker integration verification', async ({ page }) => {
    await page.click('text=Broker Status');
    await expect(page).toHaveURL('/broker');
    
    // Check broker connection status
    await expect(page.locator('text=Broker Status')).toBeVisible();
    
    // Send test message
    await page.click('button:has-text("Send Test Message")');
    
    // Verify message was sent
    await expect(page.locator('text=Message sent successfully')).toBeVisible();
  });

  test('data persistence across page navigation', async ({ page }) => {
    // Add employee
    await page.click('text=Employees');
    await page.click('button:has-text("Add Employee")');
    await page.fill('input[name="name"]', 'Jane Smith');
    await page.click('button:has-text("Save")');
    
    // Navigate away and back
    await page.click('text=Dashboard');
    await page.click('text=Employees');
    
    // Verify employee still exists
    await expect(page.locator('text=Jane Smith')).toBeVisible();
  });

  test('mobile responsiveness for employee workflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate using mobile menu
    await page.click('[aria-label="open drawer"]');
    await page.click('text=Employees');
    
    // Verify mobile layout
    await expect(page.locator('text=Employees')).toBeVisible();
    
    // Test mobile form interaction
    await page.click('button:has-text("Add Employee")');
    await page.fill('input[name="name"]', 'Mobile User');
    await page.click('button:has-text("Save")');
    
    // Verify success on mobile
    await expect(page.locator('text=Mobile User')).toBeVisible();
  });
});
