import { Browser, Page } from 'puppeteer';
import fs from 'fs';
import dotenv from 'dotenv';
import { scroll } from '../utils/scroll.js';

dotenv.config();

const keywords = process.env.keywords?.split(',') || ['solidity', 'blockchain'];
const location = process.env.location;
const english = process.env.english;
const max_pages = process.env.max_pages;

const delay_min = Number(process.env.delay_min);
const delay_max = Number(process.env.delay_max);

const delay = ms => new Promise(res => setTimeout(res, ms));

const scrape = async (
	browser: Browser,
	page: Page
): Promise<{ title: string; url: string; id: string }[]> => {
	const jobs: { title: string; url: string; id: string }[] = [];

	const keywords_test = ['solidity'];

	for (const keyword of keywords_test) {
		await page.goto(
			`https://djinni.co/jobs/?all_keywords=${keyword}&location=${location}`
		);

		await page.waitForSelector('.job-item__title-link');

		// console.log('test scrape');
		// console.log(await page.$('.job-item__title-link'));

		for (let pageNum = 1; pageNum <= Number(max_pages); pageNum++) {
			const jobsData = await page.$$eval('.job-item__title-link', els =>
				els.map(el => {
					const href = (el as HTMLAnchorElement).href;
					const id = href.match(/\/jobs\/(\d+)/)?.[1];

					return {
						title: (el as HTMLElement).innerText.trim(),
						url: href,
						id: id,
					};
				})
			);

			jobs.push(...jobsData);

			await page.evaluate(scroll);

			const nextBtn = await page.$('.bi-chevron-right');
			if (!nextBtn) break;
			await nextBtn.click();
			await delay(Math.random() * (delay_max - delay_min) + delay_min);
		}
		await delay(2000);
	}

	return jobs;
};

export default scrape;
