import puppeteer from 'puppeteer';
import fs from 'fs';
import scrape from './core/scrape.js';
import apply from './core/apply.js';
import { login } from './core/login.js';

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: null,
	});
	const page = await browser.newPage();
	await page.setViewport({ width: 1080, height: 1024 });
	await page.goto('https://ua.indeed.com');

	await login(page);

	await delay(3000);

	const jobs_test = [
		{
			title: 'Mid-Level Full Stack Developer',
			url: 'https://ua.indeed.com/?r=us&vjk=c6733e9545845869',
			id: '779426',
		},
		// {
		// 	title: 'Junior+ Full Stack Developer (Node.js + React.js) ',
		// 	url: 'https://ua.indeed.com/?r=us&vjk=7bd7517a2ea8dc0d',
		// 	id: '768587',
		// },
		// {
		// 	title: 'Senior Full Stack Engineer (Web)',
		// 	url: 'https://ua.indeed.com/?r=us&vjk=9a62e02cfc17c6a4',
		// 	id: '777049',
		// },
	];

	// const jobs = await scrape(browser, page);

	// await apply(browser, jobs_test);

	/////// возможно будут проблемы с тем, что максимальное кол-во символов будет ограничено
	////// тогда нужно будет сделать ограничение для ИИ (в промпте)

	await browser.close();
})();
