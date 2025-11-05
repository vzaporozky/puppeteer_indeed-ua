import { ElementHandle, Page } from 'puppeteer-core';
import { generateAnswerrDeepSeek } from './deepSeek.js';
import { GenerationResult } from '../core/apply.js';
import { generateCoverLetter } from './generateCoverLetter.js';

const generateAnsweres = async (
	page2: Page,
	generationPromises: Promise<GenerationResult>[],
	questions?: ElementHandle<Element>[]
) => {
	for (const elem of questions) {
		const label = await elem.$('label.form-label');
		if (!label) continue;

		const forValue = await label.evaluate(el => el.getAttribute('for'));
		if (!forValue) continue;

		const type = forValue.split('_')[1];

		if (type === 'text') {
			const textPromise = label
				.evaluate(el => el.innerText.trim())
				.then(text => generateAnswerrDeepSeek('answer', text))
				.then(answerJson => ({ answerJson, elem, forValue }));

			generationPromises.push(textPromise);
		} else if (type === 'boolean') {
			const inputRadio = await elem.$('input.form-check-input');
			if (inputRadio) {
				await inputRadio.click();
			}
		} else if (type === 'numeric') {
			const textPromise = label
				.evaluate(el => el.innerText.trim())
				.then(text => generateAnswerrDeepSeek('numeric', text))
				.then(answerJson => ({ answerJson, elem, forValue }));

			generationPromises.push(textPromise);
		}
	}

	await generateCoverLetter(page2, generationPromises);

	return generationPromises;
};
export { generateAnsweres };
