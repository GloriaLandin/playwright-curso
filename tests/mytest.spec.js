const { test, expect } = require('@playwright/test');

test('Login demo', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // captura de pantalla de la vista de la pagina que se ejecuto
    await page.screenshot({ path: 'saucedemoportal.png', fullPage: true });
    // captura de pantalla solo del texto buscado
    await page.getByText('Swag Labs').screenshot({ path: 'titlescreenshot.png' });

    await expect(page.getByText('Products')).toBeVisible();

});

test('Login demo by css class and Id', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');
    //Para localizar por Id se usa la palabra 'locator' y el numeral para buscarlo
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    /* //para buscar por clase, se agrega 'locator' y el nombre de la clase se busca con un punto
    //Ahora buscamos 'toHaveText' ya que encontrara la clase pero no comprobara el texto que contiene
    await expect(page.locator('.title')).toHaveText('Products');
    
    //Ahora se comprueba que el localizador title este visible, ya que comprobamos que se llama products
    await expect(page.locator('.title')).toBeVisible();
*/

    //Tambien, dado que se repite mucho el page.locator se puede guardar en una constante y 
    //solo utilizar esa constante en el codigo para mandar llamar la funcion 
    const productsTitle = await page.locator('.title');
    await expect(productsTitle).toHaveText('Products');
    await expect(productsTitle).toBeVisible();
});

test('Login demo by css class, Id, data-test', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    //by id
    await page.locator('#user-name').fill('standard_user');
    // by attribute id (el atributo se agrega desde la etapa de desarrollo)
    await page.locator('id=password').fill('secret_sauce');
    // by data-test (el atributo se agrega desde la etapa de desarrollo)
    await page.locator('data-test=login-button').click();
    // by css class
    const productsTitle = await page.locator('.title');
    await expect(productsTitle).toHaveText('Products');
    await expect(productsTitle).toBeVisible();
});