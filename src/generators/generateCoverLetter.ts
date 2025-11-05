import { Page } from 'puppeteer-core';
import { generateAnswerrDeepSeek } from './deepSeek.js';
import { GenerationResult } from '../core/apply.js';

const generateCoverLetter = async (
	page2: Page,
	generationPromises: Promise<GenerationResult>[]
) => {
	console.log('start generating');

	const elem = await page2.$('div.job-post__description');
	const textPromise = elem
		.evaluate(el => {
			const paragraphs = Array.from(el.querySelectorAll('p'));
			const lists = Array.from(el.querySelectorAll('ul'));

			const pTexts = paragraphs.map(p => p.innerText.trim());
			const ulTexts = lists.map(ul => {
				return Array.from(ul.querySelectorAll('li'))
					.map(li => '• ' + li.innerText.trim())
					.join('\n');
			});

			return [...pTexts, ...ulTexts].filter(t => t).join('\n\n');
		})
		.then(text => generateAnswerrDeepSeek('coverLetter', text))
		.then(answerJson => ({ answerJson, elem }));

	generationPromises.push(textPromise);

	return generationPromises;
};

export { generateCoverLetter };
