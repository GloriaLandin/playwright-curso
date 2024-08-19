// @ts-check

//test: crear la estructura de la prueba
//expect: comprobar la prueba en si
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring. que contenga (con los slash) ese texto dentro del titulo 
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link. busca el link que diga Get started
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation. (en el header)
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();

  // // Expects page to have a heading with the name of Installation.
  // await expect(page.getByRole('heading', { name: 'Installation' })).not.toBeVisible();

});
