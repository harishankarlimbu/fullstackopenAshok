import { test, expect } from '@playwright/test'

//users
const users = {
  creator: { username: 'ashok01', password: 'secret123' },
  otherUser: { username: 'ashok02', password: 'secret123' }
}

test.describe('Blog App E2E Tests', () => {
  
  // Test 5.17: Initial page load and login form visibility
  test.describe('Initial Load', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
      // Check if login form elements are visible
      await expect(page.getByText(/log in to application/i)).toBeVisible()
      await expect(page.getByTestId('username')).toBeVisible()
      await expect(page.getByTestId('password')).toBeVisible()
      await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
    })
  })

  // Test 5.18: Login functionality (success and failure cases)
  test.describe('Authentication', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/')
    })

    test('succeeds with correct credentials', async ({ page }) => {
      // Fill login form with valid credentials
      await page.getByTestId('username').fill(users.creator.username)
      await page.getByTestId('password').fill(users.creator.password)
      await page.getByRole('button', { name: 'login' }).click()
      // Verify successful login
      await expect(page.getByText('Ashok Limbu logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      // Fill login form with invalid credentials
      await page.getByTestId('username').fill('ashok')
      await page.getByTestId('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      // Verify login failure
      await expect(page.getByText('invalid username or password')).toBeVisible()
      await expect(page.getByText('Ashok Limbu logged in')).not.toBeVisible()
    })
  })

  // Test 5.19: Blog creation functionality
  test.describe('Blog Creation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/')
      // Login 
      await page.getByTestId('username').fill(users.creator.username)
      await page.getByTestId('password').fill(users.creator.password)
      await page.getByRole('button', { name: /login/i }).click()
      await page.waitForSelector('text=blogs', { timeout: 5000 })
    })

    test('a new blog can be created', async ({ page }) => {
      const uniqueTitle = `Blog Creation Test ${Date.now()}`
      await page.getByRole('button', { name: /Create new blog/i }).click()
      await page.getByTestId('title').fill(uniqueTitle)
      await page.getByTestId('author').fill('Ashok Limbu')
      await page.getByTestId('url').fill('https://ashoklimbuhelathyhome.com')
      await page.getByRole('button', { name: /^Create$/i }).click()
      // Verify blog created visible
      await expect(page.getByText(uniqueTitle).first()).toBeVisible({ timeout: 10000 })
    })
  })

  // Test 5.20: Blog liking functionality
  test.describe('Blog Liking', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/')
      await page.getByTestId('username').fill(users.creator.username)
      await page.getByTestId('password').fill(users.creator.password)
      await page.getByRole('button', { name: /login/i }).click()
      await page.waitForSelector('text=blogs', { timeout: 5000 })
    })

    test('a blog can be liked', async ({ page }) => {
      const uniqueTitle = `Like Test Blog ${Date.now()}`
      
      // Create a new blog for liking test
      await page.getByRole('button', { name: /Create new blog/i }).click()
      await page.getByTestId('title').fill(uniqueTitle)
      await page.getByTestId('author').fill('Ashok Limbu')
      await page.getByTestId('url').fill('https://ashoklimbu.com')
      await page.getByRole('button', { name: /^Create$/i }).click()

      // use first blog 
      const blogItem = page.getByTestId('blog-item').filter({
        hasText: uniqueTitle
      }).first()
      await blogItem.waitFor({ state: 'visible', timeout: 5000 })
      await blogItem.getByRole('button', { name: /view/i }).click()

      // Verify initial like count and like the blog
      const likes = blogItem.getByTestId('likes')
      await expect(likes).toHaveText('Likes: 0')
      await blogItem.getByRole('button', { name: /like/i }).click()
      
      // Verify like count increased
      await expect(likes).toHaveText('Likes: 1')
    })
  })

  // Test 5.21: Blog deletion functionality
  test.describe('Blog Deletion', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/')
      // Login 
      await page.getByTestId('username').fill(users.creator.username)
      await page.getByTestId('password').fill(users.creator.password)
      await page.getByRole('button', { name: /login/i }).click()
      await page.waitForSelector('text=blogs')
    })

    test('a blog can be removed by its creator', async ({ page }) => {
      const uniqueTitle = `Delete Test Blog ${Date.now()}`
      
      // Create a new blog for deletion test
      await page.getByRole('button', { name: /Create new blog/i }).click()
      await page.getByTestId('title').fill(uniqueTitle)
      await page.getByTestId('author').fill('Ashok Limbu')
      await page.getByTestId('url').fill('https://ashoklimbu.com')
      await page.getByRole('button', { name: /^Create$/i }).click()

      // Locate the fisrt blog to delete/remove
      const blogItem = page.getByTestId('blog-item').filter({ hasText: uniqueTitle }).first()
      await blogItem.waitFor({ state: 'visible' })
      await blogItem.getByRole('button', { name: /view/i }).click()

      // Handle confirmation dialog and delete blog
      page.on('dialog', async (dialog) => {
        await dialog.accept()
      })
      await blogItem.getByRole('button', { name: /remove/i }).click()

      // Verify blog is removed
      await expect(blogItem).toHaveCount(0)
    })
  })

  // Test 5.22: Only creator of blog see remove button , non-creator doesnot
  test.describe('Blog Remove Button Visibility', () => {
    test('only the creator sees the remove button', async ({ page }) => {
      const uniqueTitle = `Auth Test Blog ${Date.now()}`   
      // Login as creator and create a blog
      await page.goto('http://localhost:5173/')
      await page.getByTestId('username').fill(users.creator.username)
      await page.getByTestId('password').fill(users.creator.password)
      await page.getByRole('button', { name: /login/i }).click()
      await page.waitForSelector('text=blogs', { timeout: 5000 })

      // Create a blog
      await page.getByRole('button', { name: /Create new blog/i }).click()
      await page.getByTestId('title').fill(uniqueTitle)
      await page.getByTestId('author').fill('Ashok Limbu')
      await page.getByTestId('url').fill('https://creator.com')
      await page.getByRole('button', { name: /^Create$/i }).click()

      //  use first match
      const blogItem = page.getByTestId('blog-item').filter({ hasText: uniqueTitle }).first()
      await blogItem.waitFor({ state: 'visible' })
      await blogItem.getByRole('button', { name: /view/i }).click()
      await expect(blogItem.getByRole('button', { name: /remove/i })).toBeVisible()

      // Logout and login as different user
      await page.getByRole('button', { name: /logout/i }).click()
      await page.getByTestId('username').fill(users.otherUser.username)
      await page.getByTestId('password').fill(users.otherUser.password)
      await page.getByRole('button', { name: /login/i }).click()
      await page.waitForSelector('text=blogs', { timeout: 5000 })

      // Verify remove button is NOT visible for other users(use first match)
      const blogItemOther = page.getByTestId('blog-item').filter({ hasText: uniqueTitle }).first()
      await blogItemOther.waitFor({ state: 'visible' })
      await blogItemOther.getByRole('button', { name: /view/i }).click()
      await expect(blogItemOther.getByRole('button', { name: /remove/i })).not.toBeVisible()
    })
  })

  // Test 5.23: Blog sorting by likes
  test.describe('Blog Sorting', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/')
      
      // Login
      await page.getByTestId('username').fill(users.creator.username)
      await page.getByTestId('password').fill(users.creator.password)
      await page.getByRole('button', { name: /login/i }).click()
      await page.waitForSelector('text=blogs')
    })

    test('blogs are displayed in sorted order of likes', async ({ page }) => {
      const blogItems = page.getByTestId('blog-item')

      // Helper function to get likes count from a blog
      const getLikesCount = async (blog) => {
        await blog.getByRole('button', { name: /view/i }).click()
        const likesText = await blog.getByTestId('likes').textContent()
        return parseInt(likesText.replace('Likes: ', '').trim())
      }

      // Get first three blogs and their like counts
      const firstBlog = blogItems.nth(0)
      const secondBlog = blogItems.nth(1)
      const thirdBlog = blogItems.nth(2)

      const likesFirst = await getLikesCount(firstBlog)
      const likesSecond = await getLikesCount(secondBlog)
      const likesThird = await getLikesCount(thirdBlog)

      //sorted based on likes
      expect(likesFirst).toBeGreaterThanOrEqual(likesSecond)
      expect(likesSecond).toBeGreaterThanOrEqual(likesThird)
    })
  })
})