import { Page } from 'puppeteer-core';
import { GenerationResult } from './apply.js';

const finishPromise = async (
	page2: Page,
	generationPromises: Promise<GenerationResult>[]
) => {
	const results = await Promise.all(generationPromises);

	const coverLetterElement = await page2.$('textarea#message');

	console.log(results);

	for (const result of results) {
		const { answerJson, elem, forValue } = result;
		const { answer, coverLetter } = answerJson;

		if (coverLetter) {
			await coverLetterElement.type(
				` ${coverLetter.hello}

${coverLetter.aboutMe}

${coverLetter.howMySkillsFitCompany}

${coverLetter.myPassiontToWorkInCompany}

${coverLetter.myContacts}
					`.trim()
			);

			console.log(coverLetter);

			continue;
		}

		const type = forValue.split('_')[1];

		if (type === 'text') {
			const textarea = await elem.$(`textarea#${forValue}`);
			if (textarea) {
				await textarea.type(answer.trim());
			}
		} else if (type === 'numeric') {
			const input = await elem.$(`input#${forValue}`);
			if (input) {
				await input.evaluate((el, val) => {
					el.value = val;
					el.dispatchEvent(new Event('input', { bubbles: true }));
					el.dispatchEvent(new Event('change', { bubbles: true }));
				}, answer);
			}
		}
	}
};

export { finishPromise };
