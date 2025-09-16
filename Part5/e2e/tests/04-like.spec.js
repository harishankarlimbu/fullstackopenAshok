import { test, expect } from "@playwright/test";

test.describe("Blog app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // login
    await page.getByTestId("username").fill("ashok01");
    await page.getByTestId("password").fill("secret123");
    await page.getByRole("button", { name: /login/i }).click();

    // wait until login completes
    await page.waitForSelector('text=blogs', { timeout: 5000 });
  });

  test("a blog can be liked", async ({ page }) => {
    // create a new blog
    await page.getByRole("button", { name: /Create new blog/i }).click();
    await page.getByTestId("title").fill("forliking doing opp");
    await page.getByTestId("author").fill("Ashok Limbu");
    await page.getByTestId("url").fill("https://ashoklimbu.com");
    await page.getByRole("button", { name: /^Create$/i }).click();

    // wait until blog appears
    const blogItem = page.getByTestId('blog-item').filter({
      hasText: 'forliking doing opp'
    });
    await blogItem.waitFor({ state: 'visible', timeout: 5000 });

    // click the "view" button to show likes and like button
    await blogItem.getByRole("button", { name: /view/i }).click();

    const likes = blogItem.getByTestId("likes");
    await expect(likes).toHaveText("Likes: 0");

    // click like
    await blogItem.getByRole("button", { name: /like/i }).click();

    // wait for re-render
    await expect(likes).toHaveText("Likes: 1");
  });
});
