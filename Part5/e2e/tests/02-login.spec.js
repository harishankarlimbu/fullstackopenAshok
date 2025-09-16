import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
  })

  test('succeeds with correct credentials', async ({ page }) => {
    // Fill login form
    await page.getByTestId('username').fill('ashok01')
    await page.getByTestId('password').fill('secret123')
    await page.getByRole('button', { name: 'login' }).click()

    // Expect logged in user is shown
    await expect(page.getByText('Ashok Limbu logged in')).toBeVisible()
  })

  test('fails with wrong credentials', async ({ page }) => {
    await page.getByTestId('username').fill('ashok')
    await page.getByTestId('password').fill('wrongpassword')
    await page.getByRole('button', { name: 'login' }).click()

    // Expect error message
    await expect(page.getByText('invalid username or password')).toBeVisible()

    // Also check that user is NOT logged in
    await expect(page.getByText('Ashok Limbu logged in')).not.toBeVisible()
  })
})
