import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {

  // Before each test, go to the app and login
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')

    // Login
    await page.getByTestId('username').fill('ashok01')
    await page.getByTestId('password').fill('secret123')
    await page.getByRole('button', { name: /login/i }).click()

  })

  test('a new blog can be created', async ({ page }) => {
    // Open the "Create new blog" form
    await page.getByRole('button', { name: /Create new blog/i }).click()
    await page.waitForTimeout(2000) 

    // Fill form fields
    await page.getByTestId('title').fill('the shankar dai op')
    await page.waitForTimeout(500)
    await page.getByTestId('author').fill('Ashok Limbu')
    await page.waitForTimeout(500)
    await page.getByTestId('url').fill('https://ashoklimbuhelathyhome.com')
    await page.waitForTimeout(500)

    // Submit the form
    await page.getByRole('button', { name: /^Create$/i }).click()
    await page.waitForTimeout(5000)

    // Wait for new blog to appear in the list
    await expect(page.getByText('the shankar dai op')).toBeVisible({ timeout: 10000 })
  })
})
