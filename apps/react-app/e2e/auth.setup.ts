import { test as setup } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("jungmin.ji@icloud.com");
  await page.getByLabel("Password").fill("Q5kL7wPnQ6");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/posts");

  await page.context().storageState({ path: authFile });
});
