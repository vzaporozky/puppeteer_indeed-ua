import { ElementHandle, Page } from 'puppeteer-core';
import { generateDeepSeek } from './deepSeek.js';
import { GenerationResult } from '../core/apply.js';
import { generateCoverLetter } from './generateCoverLetter.js';
import { defineType } from '../utils/defineType.js';

const generateAnsweres = async (
	generationPromises: Promise<GenerationResult>[],

	questions?: ElementHandle<Element>[]
) => {
	for (const elem of questions) {
		const textSpan = await elem.$(
			'span.mosaic-provider-module-apply-questions-1wsk8bh'
		);

		const typeObj = await defineType(elem);

		console.log(typeObj.type);

		if (typeObj.type === 'text') {
			const textPromise = textSpan
				.evaluate(el => el.textContent?.trim())
				.then(text => generateDeepSeek('text', text))
				.then(answerJson => ({ answerJson, elem }));

			generationPromises.push(textPromise);
		} else if (typeObj.type === 'radio') {
			const allRadio = await elem.$$(
				'span.mosaic-provider-module-apply-questions-1hx0a07'
			);
			const radioTexts = [];

			for (const elem of allRadio) {
				const text = await elem.evaluate(el => el.textContent?.trim());
				radioTexts.push(text);
			}

			const textPromise = generateDeepSeek('radio', radioTexts).then(
				answerJson => ({ answerJson, elem })
			);
			generationPromises.push(textPromise);
		} else if (typeObj.type === 'checkbox') {
			const allCheckbox = await elem.$$(
				'span.mosaic-provider-module-apply-questions-1br6eau'
			);
			const checkboxTexts = [];

			for (const elem of allCheckbox) {
				const text = await elem.evaluate(el => el.textContent?.trim());
				checkboxTexts.push(text);
			}

			const textPromise = generateDeepSeek('checkbox', checkboxTexts).then(
				answerJson => ({ answerJson, elem })
			);
			generationPromises.push(textPromise);
		} else if (typeObj.type === 'select') {
			const select = await elem.$('select');
			const allOption = await select.$$(
				'span.mosaic-provider-module-apply-questions-1br6eau'
			);
			const selectTexts = [];

			for (const elem of allOption) {
				const text = await elem.evaluate(el => el.getAttribute('label'));
				selectTexts.push(text);
			}

			const textPromise = generateDeepSeek('select', selectTexts).then(
				answerJson => ({ answerJson, elem })
			);
			generationPromises.push(textPromise);
		}
	}

	return generationPromises;
};
export { generateAnsweres };
