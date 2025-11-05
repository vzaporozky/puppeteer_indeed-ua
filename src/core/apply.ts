import { Browser, Page } from 'puppeteer';
import fs from 'fs';
import dotenv from 'dotenv';
import { scroll } from '../utils/scroll.js';
import { generateAnsweres } from '../generators/generateAnsweres.js';
import { finishPromise } from './finishPromise.js';
import { generateCoverLetter } from '../generators/generateCoverLetter.js';

dotenv.config();

export interface GenerationResult {
	answerJson: { answer: string; coverLetter?: any };
	elem: any;
	forValue?: string;
}

const delay_min = Number(process.env.delay_min);
const delay_max = Number(process.env.delay_max);

const delay = ms => new Promise(res => setTimeout(res, ms));

const apply = async (
	browser: Browser,
	jobs: { title: string; url: string; id: string }[]
): Promise<void> => {
	let appliedCount = 0;
	const applied = JSON.parse(fs.readFileSync('applied.json', 'utf8') || '[]');

	const page2 = await browser.newPage();
	await page2.setViewport({ width: 1080, height: 1024 });

	for (const job of jobs) {
		if (!job.id || applied.includes(job.id)) continue;

		await page2.goto(job.url);

		await page2.waitForSelector('.js-inbox-toggle-reply-form');
		const element = await page2.$('.js-inbox-toggle-reply-form');
		if (!element) continue;
		await page2.evaluate(scroll);
		await element.click();

		const formApply = await page2.$('form#apply_form');
		await page2.waitForSelector('textarea#message');
		const h3_questions = await formApply.$('h3.mb-3');

		const generationPromises: Promise<GenerationResult>[] = [];
		if (h3_questions) {
			const parent = await h3_questions.evaluateHandle(el => el.parentElement);
			const questions = await parent.$$('.mb-3');
			questions.shift;

			await generateAnsweres(page2, generationPromises, questions);
		} else await generateCoverLetter(page2, generationPromises);

		await finishPromise(page2, generationPromises);

		/////////////////////
		await page2.click('button[type="submit"]');

		applied.push(job.id);
		appliedCount++;
		console.log(`Applied: ${job.title}`);
		await delay(Math.random() * (delay_max - delay_min) + delay_min);
	}
};

export default apply;
