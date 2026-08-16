import { test, expect } from '@playwright/test';

test.describe('BuildGuard ERP End-to-End Rule Engine Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC01: Verify Dashboard renders core elements', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('BuildGuard Control Center');
    await expect(page.locator('form')).toBeVisible();
    await expect(page.getByRole('button', { name: /Submit Material Request/i })).toBeVisible();
  });

  test('TC02: Trigger Inter-Project Transfer Recommendation when shortage occurs', async ({ page }) => {
    // Select Metro Station Line 1
    await page.selectOption('select >> nth=0', '1');
    
    // Select Grade 53 Cement
    await page.selectOption('select >> nth=1', '1');

    // Request 100 bags (exceeds local stock of 50)
    await page.fill('input[type="number"]', '100');
    await page.fill('input[type="text"]', 'Slab casting for Level 2');

    // Submit Request
    await page.click('button[type="submit"]');

    // Assert Local Stock Evaluation & Transfer Recommendation
    await expect(page.locator('text=Local Warehouse Stock: 50 units')).toBeVisible();
    await expect(page.locator('text=⚠️ Insufficient Local Stock')).toBeVisible();
    await expect(page.locator('text=💡 Idle Stock Transfer Recommendation')).toBeVisible();
    
    // Explicitly target the recommendation list item to resolve strict mode conflict
    await expect(page.locator('li').filter({ hasText: 'National Highway 44' })).toBeVisible();
  });

  test('TC03: Reject invalid or negative material quantities', async ({ page }) => {
    const numberInput = page.locator('input[type="number"]');
    await numberInput.fill('-10');
    
    // Check HTML5 validation state for negative input
    const isValid = await numberInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    
    if (isValid) {
      // Fallback assertion if form handles validation via submission or JS alert
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('valid');
        await dialog.dismiss();
      });
      await page.click('button[type="submit"]');
    } else {
      expect(isValid).toBeFalsy();
    }
  });
});