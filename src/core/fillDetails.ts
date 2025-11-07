import { Browser, Page } from 'puppeteer-core';
import dotenv from 'dotenv';

dotenv.config();

const salary = process.env.salary;

dotenv.config();

const delay = ms => new Promise(res => setTimeout(res, ms));

const fillDetails = async (page: Page) => {
	console.log('start fillDetails');
	// await delay(300000);

	await page.waitForSelector('input[name="cityState"]');
	// const city = await page.$('input[name="cityState"]');
	// await city.type('Kyiv');

	// const postCode = await page.$('input[name="postalCode"]');
	// await postCode.type('03022');

	await page.waitForSelector('.css-jojid8');
	await page.click('.css-jojid8');

	await page.waitForSelector('input[name="minimumPay"]');
	// const salaryInput = await page.$('input[name="minimumPay"]');
	// const actualValue = await page.$eval(
	// 	'input[name="minimumPay"]',
	// 	(el: HTMLElement) => {
	// 		return (el as HTMLInputElement).value;
	// 	}
	// );

	// if (actualValue != salary) {
	// 	await salaryInput.click({ clickCount: 3 });
	// 	await salaryInput.press('Backspace');

	// 	await salaryInput.type(salary);
	// }

	// возможно надо еще выбрать период <select Період оплати, тип   <option label="на місяць"

	await page.waitForSelector('.css-jojid8');
	await page.click('.css-jojid8');

	// и возможно добавить желаемые позиции

	await page.waitForSelector('.css-jojid8');
	await page.click('.css-jojid8');

	await delay(2000);
};

export { fillDetails };
