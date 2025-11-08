import axios from 'axios';
import dotenv from 'dotenv';
import { extractJson } from '../utils/extractJSON.js';
import { cv } from '../data/cv_web3.js';

dotenv.config();

const apiKey = process.env.DEEP_SEEK_API;
const apiUrl = 'https://api.deepseek.com/v1/chat/completions';

async function generateDeepSeek(answer: string, text?: string | string[]) {
	console.log('start gen deepseek ' + text);
	try {
		let prompt;
		if (answer == 'coverLetter') {
			prompt = `Мое резюме = ${cv}.
        Вакансия = ${text}.
        Сгенерируй cover letter(на английском языке) для вакансии. Пиши от моего лица и не упоминай резюме.
        Если в вакансии требуются навыки, которых нет в моем резюме, 
        то ничего об этом не пиши - делай акцент на моих навыках.
        Письмо раздели на блоки: hello, aboutMe, howMySkillsFitCompany, myPassiontToWorkInCompany, myContacts.
        Верни результат в JSON. пример json: {coverLetter:{hello:string, aboutMe:string, 
        howMySkillsFitCompany:string, myPassiontToWorkInCompany:string, myContacts:string }}.
        `;
		} else if (answer == 'text') {
			prompt = `
        Ответь на вопрос(на английском языке). Пиши от моего лица и не упоминай резюме.
        Мое резюме = ${cv}. 
        Вопрос = ${text}. 
        Верни результат в JSON. пример json: {answer:string}.
        `;
		} else if (answer == 'radio' || answer == 'select') {
			prompt = `
        Выбери один вариант из предоставленых основываясь на моем cv.
        Мое резюме = ${cv}. 
        Варианты = ${text}. 
				Ответ должен быть одним и таким же как вариант.
        Верни результат в JSON. пример json: {answer:sting}.
        `;
		} else if (answer == 'checkbox') {
			prompt = `
        Выбери один или несколько вариантов из предоставленых основываясь на моем cv.
        Мое резюме = ${cv}. 
        Варианты = ${text}. 
				Ответ должен быть одним и таким же как вариант.
        Верни результат в JSON. пример json: {answer:sting[]}.
        `;
		}

		const response = await axios.post(
			apiUrl,
			{
				model: 'deepseek-chat',
				messages: [{ role: 'user', content: prompt }],
				max_tokens: 4000,
				temperature: 0.9,
			},
			{
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
			}
		);

		const json_data = extractJson(response);

		return json_data;
	} catch (error) {
		console.log(
			'Error processing with DeepSeek API:',
			error.response ? error.response.data : error.message
		);
		return null;
	}
}

export { generateDeepSeek };
