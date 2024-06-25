const { test } = require('@playwright/test');

export async function login(page) {
    await test.step('Login', async () => {
        await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
        await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();

        await page.screenshot({ path: 'saucedemoportal.png', fullPage: true });
    })
}