import { test, expect } from "@playwright/test";

test.describe("Blog remove button visibility", () => {
  const creator = { username: "ashok01", password: "secret123" };
  const otherUser = { username: "ashok02", password: "secret123" };
  const blogTitle = "Creator Only Blog";

  test("only the creator sees the remove button", async ({ page }) => {
    // Login as creator
    await page.goto("http://localhost:5173/");
    await page.getByTestId("username").fill(creator.username);
    await page.getByTestId("password").fill(creator.password);
    await page.getByRole("button", { name: /login/i }).click();
    await page.waitForSelector('text=blogs', { timeout: 5000 });

    // Create a blog 
    await page.getByRole("button", { name: /Create new blog/i }).click();
    await page.getByTestId("title").fill(blogTitle);
    await page.getByTestId("author").fill("Ashok Limbu");
    await page.getByTestId("url").fill("https://creator.com");
    await page.getByRole("button", { name: /^Create$/i }).click();

    const blogItem = page.getByTestId('blog-item').filter({ hasText: blogTitle });
    await blogItem.waitFor({ state: 'visible' });

    //Expand blog and check remove button for creator
    await blogItem.getByRole("button", { name: /view/i }).click();
    await expect(blogItem.getByRole("button", { name: /remove/i })).toBeVisible();

    //Logout
    await page.getByRole("button", { name: /logout/i }).click();

    //Login as another user
    await page.getByTestId("username").fill(otherUser.username);
    await page.getByTestId("password").fill(otherUser.password);
    await page.getByRole("button", { name: /login/i }).click();
    await page.waitForSelector('text=blogs', { timeout: 5000 });

    //Expand the same blog
    const blogItemOther = page.getByTestId('blog-item').filter({ hasText: blogTitle });
    await blogItemOther.waitFor({ state: 'visible' });
    await blogItemOther.getByRole("button", { name: /view/i }).click();

    //remove button NOT visible for non-creator
    await expect(blogItemOther.getByRole("button", { name: /remove/i })).not.toBeVisible();
  });
});
