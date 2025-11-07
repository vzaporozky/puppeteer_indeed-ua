import { Browser, Page } from 'puppeteer-core';
import fs from 'fs';
import dotenv from 'dotenv';
import { scroll } from '../utils/scroll.js';
import { closeAskNotify } from '../utils/closeAskNotify.js';

dotenv.config();

const keywords = process.env.keywords?.split(',') || ['solidity', 'blockchain'];
const max_pages = process.env.max_pages;
const language = process.env.language;

const delay_min = Number(process.env.delay_min);
const delay_max = Number(process.env.delay_max);

const delay = ms => new Promise(res => setTimeout(res, ms));

const scrape = async (page: Page): Promise<string[]> => {
	const jobs: string[] = [];

	// const keywords_test = ['solidity'];

	await page.goto(
		`https://ua.indeed.com/jobs?q=full+stack+developer&l=%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F+%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0&from=searchOnHP&vjk=e57a981ac5b39e2b`
	);

	for (let pageNum = 1; pageNum <= Number(max_pages); pageNum++) {
		await closeAskNotify(page);

		await page.waitForSelector('div[data-testid="slider_item"]');
		const jobCards = await page.$$('div[data-testid="slider_item"]');

		for (const card of jobCards) {
			const indeed_apply = await card.$('span.iaIcon');
			if (!indeed_apply) continue;

			const link = await card.$('a.jcs-JobTitle');
			if (!link) continue;

			let job_url = await link.evaluate(el => el.getAttribute('href'));
			if (!job_url) continue;

			if (job_url[0] == '/')
				job_url = `https://${language}.indeed.com${job_url}`;

			jobs.push(job_url);
		}

		await page.evaluate(scroll);

		const nextBtn = await page.$('a[data-testid="pagination-page-next"]');
		if (!nextBtn) break;
		let nextUrl = await nextBtn.evaluate(el => el.getAttribute('href'));
		if (nextUrl[0] == '/') nextUrl = `https://${language}.indeed.com${nextUrl}`;

		await page.goto(nextUrl);
		await delay(Math.random() * (delay_max - delay_min) + delay_min);
	}

	await delay(3000);

	return jobs;
};

export default scrape;
