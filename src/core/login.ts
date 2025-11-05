import { Page } from 'puppeteer-core';
import dotenv from 'dotenv';

dotenv.config();

const email = process.env.email;
const password = process.env.password;

const login = async (page: Page) => {
	await page.waitForSelector('.sign-in-link');
	await page.click('.sign-in-link');

	await page.waitForSelector('#email');
	await page.type('#email', email);
	await page.type('#password', password);
	await page.click('.btn-primary');
};

export { login };
