import { test, expect } from "@playwright/test";

test.describe("Blogs sorted by likes", () => {
  const user = { username: "ashok01", password: "secret123" };

  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Login
    await page.getByTestId("username").fill(user.username);
    await page.getByTestId("password").fill(user.password);
    await page.getByRole("button", { name: /login/i }).click();
    await page.waitForSelector('text=blogs');
  });

  test("blogs are displayed in descending order of likes", async ({ page }) => {
    const blogItems = page.getByTestId('blog-item');

    // get first three blogs
    const first = blogItems.nth(0);
    const second = blogItems.nth(1);
    const third = blogItems.nth(2);

    // get likes text for each
    const likesText = async (blog) => {
      await blog.getByRole("button", { name: /view/i }).click(); 
      return (await blog.getByTestId("likes").textContent()).replace("Likes: ", "").trim();
    };

    const likesFirst = parseInt(await likesText(first));
    const likesSecond = parseInt(await likesText(second));
    const likesThird = parseInt(await likesText(third));

    // sorted order
    expect(likesFirst).toBeGreaterThanOrEqual(likesSecond);
    expect(likesSecond).toBeGreaterThanOrEqual(likesThird);
  });
});
