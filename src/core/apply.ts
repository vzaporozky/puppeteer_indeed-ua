import { Browser, Page } from 'puppeteer-core';
import fs from 'fs';
import dotenv from 'dotenv';
import { scroll } from '../utils/scroll.js';
import { generateAnsweres } from '../generators/generateAnsweres.js';
import { finishPromise } from './finishPromise.js';
import { generateCoverLetter } from '../generators/generateCoverLetter.js';
import answerEasyQuest from '../generators/answerEasyQuest.js';
import { defineType } from '../utils/defineType.js';

dotenv.config();

export interface GenerationResult {
	answerJson: { answer: string; coverLetter?: any };
	elem: any;
	forValue?: string;
}

const delay_min = Number(process.env.delay_min);
const delay_max = Number(process.env.delay_max);

const delay = ms => new Promise(res => setTimeout(res, ms));

const apply = async (browser: Browser, jobs: string[]): Promise<void> => {
	let appliedCount = 0;
	// const applied = JSON.parse(fs.readFileSync('applied.json', 'utf8') || '[]');

	const page2 = await browser.newPage();
	await page2.setViewport({ width: 1080, height: 1024 });

	for (const job of jobs) {
		// console.log(job);
		// if (!job.id || applied.includes(job.id)) continue;

		await page2.goto(job);

		await delay(3000);

		const oldBlock = await page2.$('.css-1j9ktms');
		if (oldBlock) continue;
		await delay(2000);

		const btnApply = await page2.$('button.css-a75pkb');
		if (!btnApply) continue;
		await btnApply.click();
		await delay(4000);

		const allButtonsFirst = await page2.$$('button[type="button"]');
		await allButtonsFirst[1].click(); // продолжить

		await delay(5000);
		const allQuestions = await page2.$$(
			'div.ia-Questions-item mosaic-provider-module-apply-questions-1iqcevu'
		);
		console.log('found all questions');

		if (allQuestions) {
			const questions = [];
			const generationPromises: Promise<GenerationResult>[] = [];

			for (const question of allQuestions) {
				const typeObj = await defineType(question);
				if (!typeObj) continue;

				console.log('defined type');

				const textSpan = await question.$(
					'span.mosaic-provider-module-apply-questions-1wsk8bh'
				);
				const text = await textSpan.evaluate(el => el.textContent?.trim());
				const easy = await answerEasyQuest(question, text);
				if (easy) continue;

				console.log(easy);

				const requird = await question.$(
					'span.mosaic-provider-module-apply-questions-cqp66h'
				);
				if (!requird) continue;

				console.log(requird);

				questions.push(question);
			}

			await generateAnsweres(generationPromises, questions);
			await finishPromise(page2, generationPromises);

			await delay(1000);
			const error = await page2.$(
				'div.mosaic-provider-module-apply-questions-1ygtsft'
			);
			if (error) continue;
		}

		await delay(3000);

		const allButtonsFinish = await page2.$$('button[type="button"]');
		await allButtonsFinish[6].click(); // продолжить

		// await generateCoverLetter(page2, generationPromises);

		// /////////////////////
		// await page2.click('button[type="submit"]');

		// applied.push(job.id);
		// appliedCount++;
		// console.log(`Applied: ${job.title}`);
		await delay(Math.random() * (delay_max - delay_min) + delay_min);
	}
};

export default apply;
