import { Browser, Page } from 'puppeteer-core';
import dotenv from 'dotenv';

dotenv.config();

const salary = process.env.salary;

dotenv.config();

const delay = ms => new Promise(res => setTimeout(res, ms));

const closeAskNotify = async (page: Page) => {
	await page.waitForSelector('.css-1rmnyb1');
	const notification = await page.$('.css-1rmnyb1');

	if (notification) {
		await page.click('.css-1rmnyb1');
		await delay(1000);
	}
};

export { closeAskNotify };
