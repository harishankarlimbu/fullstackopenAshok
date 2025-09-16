import { test, expect } from "@playwright/test";

test.describe("Blog app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // login
    await page.getByTestId("username").fill("ashok01");
    await page.getByTestId("password").fill("secret123");
    await page.getByRole("button", { name: /login/i }).click();

    // wait until logged in
    await page.waitForSelector('text=blogs');
  });

  test("a blog can be removed by its creator", async ({ page }) => {
    // create a new blog
    await page.getByRole("button", { name: /Create new blog/i }).click();
    await page.getByTestId("title").fill("tobedeletedpanda");
    await page.getByTestId("author").fill("Ashok Limbu");
    await page.getByTestId("url").fill("https://ashoklimbu.com");
    await page.getByRole("button", { name: /^Create$/i }).click();

    // locate the created blog by title
    const blogItem = page.getByTestId('blog-item').filter({ hasText: 'tobedeletedpanda' });
    await blogItem.waitFor({ state: 'visible' });

    // click "view" to show remove button
    await blogItem.getByRole("button", { name: /view/i }).click();

    // handle window.confirm dialog
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    // click remove
    await blogItem.getByRole("button", { name: /remove/i }).click();

    // assert the blog is removed
    await expect(blogItem).toHaveCount(0);
  });
});
