import { ElementHandle, Page } from 'puppeteer-core';
import fs from 'fs';
import dotenv from 'dotenv';
import { scroll } from '../utils/scroll.js';

dotenv.config();

const delay = ms => new Promise(res => setTimeout(res, ms));

const answers: Record<string, string> = {
	experience: process.env.ADD_DEFAULT_EXPERIENCE || '',
	'javascript experience': process.env.ADD_JAVASCRIPT || '',
	phone: process.env.ADD_PHONE || '',
	address: process.env.ADD_ADDRESS || '',
	city: process.env.ADD_CITY || '',
	'github url': process.env.ADD_GITHUB || '',
	'leadership experience': process.env.ADD_LEADERSHIP || '',
	'programming experience': process.env.ADD_PROGRAMMING || '',
	salary: process.env.ADD_SALARY || '',
	gender: process.env.ADD_GENDER || '',
	state: process.env.ADD_STATE || '',
	'linkedin url': process.env.ADD_LINKEDIN || '',
	college: process.env.ADD_UNIVERSITY || '',
	'available to work': process.env.ADD_AVAILABLE || '',
};

async function clearAndType(input: ElementHandle, text: string) {
	await input.click({ clickCount: 3 });
	await input.press('Backspace');
	await input.press('Delete');
	await input.type(text, { delay: 50 });
}

const answerEasyQuest = async (
	question: ElementHandle<Element>,
	questionText
): Promise<boolean> => {
	await delay(3000);

	// await page2.waitForSelector('button.css-a75pkb');
	// const btnApply = await page2.$('button.css-a75pkb');

	// await btnApply.evaluate(scroll);
	// await btnApply.click();

	let answer = '';

	if (
		questionText.includes('experience') &&
		![
			'javascript',
			'typescript',
			'node.js',
			'next.js',
			'nest.js',
			'programming',
		].some(k => questionText.includes(k))
	) {
		answer = answers.experience;
	} else if (questionText.includes('javascript experience'))
		answer = answers['javascript experience'];
	else if (questionText.includes('phone')) answer = answers.phone;
	else if (questionText.includes('address')) answer = answers.address;
	else if (questionText.includes('city')) answer = answers.city;
	else if (questionText.includes('github url')) answer = answers['github url'];
	else if (questionText.includes('programming experience'))
		answer = answers['programming experience'];
	else if (questionText.includes('salary')) answer = answers.salary;
	else if (questionText.includes('gender')) answer = answers.gender;
	else if (questionText.includes('state')) answer = answers.state;
	else if (questionText.includes('linkedin url'))
		answer = answers['linkedin url'];
	else if (questionText.includes('college')) answer = answers.college;
	else if (questionText.includes('interview')) answer = answers.interview;
	else if (questionText.includes('available to work the following hours')) {
		answer = answers['available to work'];
	}

	if (answer) {
		const input = await question.$(
			'.mosaic-provider-module-apply-questions-16h2nf0'
		);
		await clearAndType(input, answer);

		return true;
	}
	return false;
};

export default answerEasyQuest;
