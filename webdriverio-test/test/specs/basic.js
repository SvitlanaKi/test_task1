/** @format */

const { describe, it, before, after } = require("mocha");
const { expect } = require("chai");
const { remote } = require("webdriverio");

describe("Sauce Demo Tests", () => {
	let browser;

	before(async () => {
		browser = await remote({
			capabilities: {
				browserName: "chrome",
			},
		});
	});

	after(async () => {
		await browser.deleteSession();
	});

	beforeEach(async () => {
		await browser.url("https://www.saucedemo.com");
		await browser.setValue('[data-test="username"]', "standard_user");
		await browser.setValue('[data-test="password"]', "secret_sauce");
		const loginButton = await browser.$("#login-button");
		await loginButton.click();
	});

	//Test 1

	it("should log in successfully", async () => {
		const url = await browser.getUrl();
		expect(url).to.equal("https://www.saucedemo.com/inventory.html");

		const inventoryTitle = await browser.$(".title");
		const titleText = await inventoryTitle.getText();
		expect(titleText).to.equal("Products");
	});

	// Test 2

	it("should display error message for invalid login", async () => {
		const errorIcon = await browser.$(".error-icon");
		const loginField = await browser.$('[data-test="username"]');
		const passwordField = await browser.$('[data-test="password"]');
		const errorMessage = await browser.$(".error-message");

		assert.strictEqual(await errorIcon.isDisplayed(), true);
		assert.strictEqual(await loginField.getCSSProperty("border-color"), "rgb(255, 0, 0)");
		assert.strictEqual(await passwordField.getCSSProperty("border-color"), "rgb(255, 0, 0)");
		assert.strictEqual(
			await errorMessage.getText(),
			"Epic sadface: Username and password do not match any user in this service",
		);
	});

	// Test 3

	it("should display error message for invalid login", async () => {
		const errorIcon = await browser.$(".error-icon");
		const loginField = await browser.$('[data-test="username"]');
		const passwordField = await browser.$('[data-test="password"]');
		const errorMessage = await browser.$(".error-message");

		assert.strictEqual(await errorIcon.isDisplayed(), true);
		assert.strictEqual(await loginField.getCSSProperty("border-color"), "rgb(255, 0, 0)");
		assert.strictEqual(await passwordField.getCSSProperty("border-color"), "rgb(255, 0, 0)");
		assert.strictEqual(
			await errorMessage.getText(),
			"Epic sadface: Username and password do not match any user in this service",
		);
	});

	// Test 4

	it("should display menu and logout successfully", async () => {
		const menuButton = await browser.$(".bm-burger-button");
		await menuButton.click();

		const menu = await browser.$(".bm-menu-wrap");
		const menuItems = await menu.$$(".bm-item");

		assert.strictEqual(await menu.isDisplayed(), true);
		assert.strictEqual(menuItems.length, 4);

		const logoutButton = await browser.$("#logout_sidebar_link");
		await logoutButton.click();

		const loginPage = await browser.$('[data-test="login-button"]');
		const usernameField = await browser.$('[data-test="username"]');
		const passwordField = await browser.$('[data-test="password"]');

		assert.strictEqual(await loginPage.isDisplayed(), true);
		assert.strictEqual(await usernameField.getValue(), "");
		assert.strictEqual(await passwordField.getValue(), "");
	});

	// Test 5

	it("Verify adding a product to the cart", async () => {
		const addToCartButton = await browser.$(".btn_inventory");
		await addToCartButton.click();

		const cartItemCount = await browser.$(".shopping_cart_badge");
		assert.strictEqual(await cartItemCount.getText(), "1");

		const menuButton = await browser.$(".bm-burger-button");
		await menuButton.click();

		const logoutButton = await browser.$("#logout_sidebar_link");
		await logoutButton.click();

		await browser.url("https://www.saucedemo.com");
		await browser.setValue('[data-test="username"]', "standard_user");
		await browser.setValue('[data-test="password"]', "secret_sauce");
		const loginButton2 = await browser.$("#login-button");
		await loginButton2.click();

		const inventoryPage = await browser.$(".inventory_container");
		const cartItemCount2 = await browser.$(".shopping_cart_badge");

		assert.strictEqual(await inventoryPage.isDisplayed(), true);
		assert.strictEqual(await cartItemCount2.getText(), "1");
	});

	// Test 6

	it("Should verify sorting by name (A to Z)", async () => {
		await driver.url("https://www.saucedemo.com/inventory.html");
		const sortDropdown = await driver.$(".product_sort_container");
		const productNames = await driver.$$(".inventory_item_name");

		await sortDropdown.selectByValue("az");

		const sortedProductNames = await Promise.all(
			productNames.map(async productName => {
				return await productName.getText();
			}),
		);

		expect(sortedProductNames).to.deep.equal(sortedProductNames.slice().sort());
	});

	it("Should verify sorting by name (Z to A)", async () => {
		await driver.url("https://www.saucedemo.com/inventory.html");
		const sortDropdown = await driver.$(".product_sort_container");
		const productNames = await driver.$$(".inventory_item_name");

		await sortDropdown.selectByValue("za");

		const sortedProductNames = await Promise.all(
			productNames.map(async productName => {
				return await productName.getText();
			}),
		);

		const reversedSortedProductNames = sortedProductNames.slice().sort().reverse();

		expect(sortedProductNames).to.deep.equal(reversedSortedProductNames);
	});

	it("Should verify sorting by price (Low to High)", async () => {
		await driver.url("https://www.saucedemo.com/inventory.html");
		const sortDropdown = await driver.$(".product_sort_container");
		const productPrices = await driver.$$(".inventory_item_price");

		await sortDropdown.selectByValue("lohi");

		const sortedProductPrices = await Promise.all(
			productPrices.map(async productPrice => {
				return parseFloat(await productPrice.getText().slice(1));
			}),
		);

		expect(sortedProductPrices).to.deep.equal(sortedProductPrices.slice().sort((a, b) => a - b));
	});

	it("Should verify sorting by price (High to Low)", async () => {
		await driver.url("https://www.saucedemo.com/inventory.html");
		const sortDropdown = await driver.$(".product_sort_container");
		const productPrices = await driver.$$(".inventory_item_price");

		await sortDropdown.selectByValue("hilo");

		const sortedProductPrices = await Promise.all(
			productPrices.map(async productPrice => {
				return parseFloat(await productPrice.getText().slice(1));
			}),
		);

		expect(sortedProductPrices).to.deep.equal(sortedProductPrices.slice().sort((a, b) => b - a));
	});

	// Test 7
	it("Should open Twitter link", async () => {
		const footerLinks = await driver.$$(".footer_social_icons a");
		const twitterLink = await footerLinks[0].getAttribute("href");
		await footerLinks[0].click();

		const windowHandles = await driver.getWindowHandles();
		await driver.switchToWindow(windowHandles[1]);

		expect(await driver.getUrl()).to.equal(twitterLink);

		await driver.closeWindow();
		await driver.switchToWindow(windowHandles[0]);
	});

	it("Should open Facebook link", async () => {
		const footerLinks = await driver.$$(".footer_social_icons a");
		const facebookLink = await footerLinks[1].getAttribute("href");
		await footerLinks[1].click();

		const windowHandles = await driver.getWindowHandles();
		await driver.switchToWindow(windowHandles[1]);

		expect(await driver.getUrl()).to.equal(facebookLink);

		await driver.closeWindow();
		await driver.switchToWindow(windowHandles[0]);
	});

	it("Should open Linkedin link", async () => {
		const footerLinks = await driver.$$(".footer_social_icons a");
		const linkedinLink = await footerLinks[2].getAttribute("href");
		await footerLinks[2].click();

		const windowHandles = await driver.getWindowHandles();
		await driver.switchToWindow(windowHandles[1]);

		expect(await driver.getUrl()).to.equal(linkedinLink);

		await driver.closeWindow();
		await driver.switchToWindow(windowHandles[0]);
	});

	// Test 8
	it("Should add an item to cart and complete the checkout process", async () => {
		const addToCartButton = await driver.$(".btn_primary");
		await addToCartButton.click();

		const cartItemCount = await driver.$(".shopping_cart_badge");
		expect(await cartItemCount.getText()).to.equal("1");

		const cartButton = await driver.$(".shopping_cart_link");
		await cartButton.click();
		expect(await driver.getUrl()).to.include("/cart.html");

		const checkoutButton = await driver.$(".btn_action.checkout_button");
		await checkoutButton.click();
		expect(await driver.getUrl()).to.include("/checkout-step-one.html");

		const firstNameField = await driver.$('[data-test="firstName"]');
		await firstNameField.setValue("Any random First Name");

		const lastNameField = await driver.$('[data-test="lastName"]');
		await lastNameField.setValue("Any random Last Name");

		const postalCodeField = await driver.$('[data-test="postalCode"]');
		await postalCodeField.setValue("Any random Postal Code");

		const continueButton = await driver.$(".btn_primary.cart_button");
		await continueButton.click();
		expect(await driver.getUrl()).to.include("/checkout-step-two.html");

		const finishButton = await driver.$(".btn_action.cart_button");
		await finishButton.click();
		expect(await driver.getUrl()).to.include("/checkout-complete.html");

		const completeHeaderText = await driver.getText(".complete-header");
		expect(completeHeaderText).to.equal("THANK YOU FOR YOUR ORDER!");

		const backHomeButton = await driver.$(".btn_secondary");
		await backHomeButton.click();
		expect(await driver.getUrl()).to.include("/inventory.html");

		expect(await cartItemCount.isDisplayed()).to.be.false;
	});

	// Test 9
	it("Should navigate to the cart page and check if the cart is empty", async () => {
		const cartButton = await driver.$(".shopping_cart_link");
		await cartButton.click();
		expect(await driver.getUrl()).to.include("/cart.html");

		const checkoutButton = await driver.$(".btn_action.checkout_button");
		await checkoutButton.click();

		expect(await driver.getUrl()).to.include("/cart.html");

		const emptyCartText = await driver.getText(".cart_list .subheader");
		expect(emptyCartText).to.equal("Your Cart is Empty");
	});
});
