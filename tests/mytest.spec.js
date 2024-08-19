const { test, expect } = require('@playwright/test');
//Se ejecuta antes de todas las pruebas una vez
import { login } from './testutils';

test.beforeAll('Setup', async () => {
    console.log("Starting execution")
});
//Se ejecuta antes de cada una de las pruebas.
//page es para ubicar dentro del navegador todas las opciones de la prueba
test.beforeEach("Test setup", async ({ page }) => {
    //se utiliza path relativo porque en el archivo playwright.config.js ya se establecio la BaseUrl
    await page.goto("/");
})

test.afterAll("Complete", async () => {
    console.log("Test Done!");
})
//toma captura de pantalla de todas las pruebas. El test Info es para hacerlo dinamico 
//y tome el nombre de cada titulo de la prueba
test.afterEach("Complete", async ({ page }, testInfo) => {
    await page.screenshot({ path: `${testInfo.title}.png`, fullPage: true });
})

//describe solo agrupa el tipo de pruebas que lo contiene
test.describe("Login", async () => {
//test.skip (evita esa prueba)
//test.only (prueba solo esa prueba)
    test('Login demo', async ({ page }) => {
        test.slow(); //espera un tiempo mayor para encontrar los elementos cuando una pagina esta muy cargada o tarda mucho en cargar
//para lanzarlo desde la linea de comandos para que ejecute las pruebas slow o fast se escribe 'npx playwright test --grep "@slow"'
//getByRole ubica todos los elementos de la pagina
//los inputs de tipo text son textbox
//fill llena con datos algo
//el id y se llaman username, password, value:login
        await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
        await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();

        // captura de pantalla de la vista de la pagina que se ejecuto
        await page.screenshot({ path: 'saucedemoportal.png', fullPage: true });
        // captura de pantalla solo del texto buscado
        await page.getByText('Swag Labs').screenshot({ path: 'titlescreenshot.png' });
//expect porque espera un texto llamado Products, ya que es un span
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

});

test.describe("Login and price", async () => {

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
        //pasos para cada prueba
        //login(page) reutiliza el codigo de login para que no tengamos que estarlo poniendo en cada caso de prueba. viene del archivo testutils.js y se declara como funcion y se manda llamar desde arriba con un import
        await login(page);

        await test.step('Login', async () => {
            await expect(await page.locator("(//div[contains(@class, 'inventory_item_price')])[1]")).toHaveText("$29.99")
        });
    });

    test('Login demo order low to high price and first price', async ({ page }) => {

        await login(page);

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

});