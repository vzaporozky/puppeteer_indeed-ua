import { Browser, Page } from 'puppeteer-core';
import dotenv from 'dotenv';

dotenv.config();

const email = process.env.email;
const password = process.env.password;

const delay = ms => new Promise(res => setTimeout(res, ms));

const popupClosed = async (popup: Page) => {
	for (let i = 0; i < 30; i++) {
		if (await popup.isClosed()) return true;
		await delay(1000);
		console.log(i);
	}
	return false;
};

const login = async (browser: Browser, page: Page) => {
	await page.waitForSelector('.css-e0l5x9');
	await page.click('.css-e0l5x9');

	await page.waitForSelector('button#login-google-button');

	const [popup] = await Promise.all([
		new Promise<Page | null>(resolve =>
			browser.once('targetcreated', async target => {
				const page = await target.page();
				resolve(page);
			})
		),
		page.click('button#login-google-button'),
	]);

	if (!popup) {
		throw new Error('Google popup не открылся');
	}

	await popup.waitForSelector('input[type="email"]');
	await popup.type('input[type="email"]', email);
	await popup.click('#identifierNext');

	await delay(3000);
	await popup.waitForSelector('input[type="password"]');
	await popup.type('input[type="password"]', password);
	await popup.click('#passwordNext');

	await delay(3000);

	console.log('await popupClosed(popup);');
	const closed = await popupClosed(popup);
	if (!closed) {
		throw new Error('Popup не закрылся после логина');
	}

	await delay(3000);
	console.log('page.waitForNavigation');
	// await page
	// 	.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 })
	// 	.catch(() => {
	// 		console.warn('Основная страница не обновилась, но продолжаем...');
	// 	});
	console.log('end login');
};

export { login };
