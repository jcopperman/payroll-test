import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard with correct title', async ({ page }) => {
    await expect(page.locator('h4')).toContainText('Dashboard');
  });

  test('should show statistics cards', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('[data-testid="stats-card"]', { timeout: 10000 });

    // Check that all stat cards are visible
    const statCards = page.locator('[data-testid="stats-card"]');
    await expect(statCards).toHaveCount(4);

    // Verify specific stats are present using more specific selectors
    await expect(statCards.filter({ hasText: 'Total Employees' })).toBeVisible();
    await expect(statCards.filter({ hasText: 'Active Timesheets' })).toBeVisible();
    await expect(statCards.filter({ hasText: 'Total Hours' })).toBeVisible();
    // Wait for Broker Status heading if present
    await page.waitForTimeout(500);
    const brokerHeading = page.locator('[data-testid="heading-broker-status"]');
    if (await brokerHeading.count() > 0) {
      await expect(brokerHeading).toBeVisible();
    }
  });

  test('should display quick action cards', async ({ page }) => {
    await page.waitForSelector('[data-testid="quick-action-card"]', { timeout: 10000 });

    const actionCards = page.locator('[data-testid="quick-action-card"]');
    await expect(actionCards).toHaveCount(3);

    // Verify action card titles using more specific selectors
    const quickActionTitles = actionCards.locator('h6');
    await expect(quickActionTitles.filter({ hasText: 'Add Employee' })).toBeVisible();
    await expect(quickActionTitles.filter({ hasText: 'Clock In/Out' })).toBeVisible();
    await expect(quickActionTitles.filter({ hasText: 'View Payroll' })).toBeVisible();
  });

  test('should navigate to employees page from quick action', async ({ page }) => {
    await page.waitForSelector('[data-testid="quick-action-card"]', { timeout: 10000 });
    
  // Click on Add Employee card
  const addEmployeeCard = page.locator('text=Add Employee').first();
  await addEmployeeCard.click();
  // Wait for Employees heading to be visible
  await page.waitForSelector('[data-testid="heading-employees"]', { timeout: 5000 });
  await expect(page.locator('[data-testid="heading-employees"]')).toBeVisible();
  // Verify navigation
  await expect(page).toHaveURL('/employees');
  });

  test('should show recent activity section', async ({ page }) => {
    await page.waitForSelector('text=Recent Activity', { timeout: 10000 });
    
    await expect(page.locator('h5:has-text("Recent Activity")')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify mobile navigation is accessible
    const menuButton = page.locator('[aria-label="open drawer"]');
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();

    // Use more specific selectors for navigation items if possible
    await expect(page.locator('[data-testid="nav-dashboard"]:visible')).toBeVisible();
    await expect(page.locator('[data-testid="nav-employees"]:visible')).toBeVisible();
    await expect(page.locator('[data-testid="nav-timesheets"]:visible')).toBeVisible();
  });
});
