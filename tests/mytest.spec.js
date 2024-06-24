const { test, expect } = require('@playwright/test');
//Se ejecuta antes de todas las pruebas una vez
test.beforeAll('Setup', async () => {
    console.log("Starting execution")
});

test.beforeEach("Test setup", async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
})

test('Login demo', async ({ page }) => {
    test.slow();

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



    //by id
    await page.locator('#user-name').fill('standard_user');
    // by attribute id (el atributo se agrega desde la etapa de desarrollo)
    await page.locator('id=password').fill('secret_sauce');
    // by data-test (el atributo se agrega desde la etapa de desarrollo)
    await page.locator('data-test=login-button').click();
    //se usa cuando hay muchas redirecciones a otras paginas al momento de hacer clic, y al final llega
    //a la pagina "inventory.html". Espera a que llegue esa URL para poder continuar el codigo
    await page.waitForURL('**/inventory.html');
    // by css class
    const productsTitle = await page.locator('.title');
    await expect(productsTitle).toHaveText('Products');
    await expect(productsTitle).toBeVisible();
    //comprueba la url, y .* indica que puede haber cualquier tipo de informacion, 
    //para no depender del cambio de dominio
    await expect(page).toHaveURL(/.*inventory.html/);
});

test('Login demo and first price @fast', async ({ page }) => {


    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Products')).toBeVisible();

    await expect(await page.locator("(//div[contains(@class, 'inventory_item_price')])[1]")).toHaveText("$29.99")
});

test('Login demo order low to high price and first price', async ({ page }) => {


    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Products')).toBeVisible();

    //seleccionar un elemento por valor de la lista
    //await page.locator('.product_sort_container').selectOption("lohi");

    //seleccionar un elemento por label de la lista
    //await page.locator('.product_sort_container').selectOption({ label: "Price (low to high)" });

    //key press se puede utilizar press para simular presionar una tecla del teclado
    await page.locator('.product_sort_container').press("ArrowDown");
    await page.locator('.product_sort_container').press("ArrowDown");

    //comprobar que el primer elemento tenga ese texto
    await expect(await page.locator("(//div[contains(@class, 'inventory_item_price')])[1]")).toHaveText("$7.99");
    //comprobar que el ultimo elemento tenga ese texto
    await expect(await page.locator("(//div[contains(@class, 'inventory_item_price')])[last()]")).toHaveText("$49.99");


});