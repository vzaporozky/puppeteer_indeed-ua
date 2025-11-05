import axios from 'axios';
import dotenv from 'dotenv';
import { extractJson } from '../utils/extractJSON.js';
import { cv } from '../data/cv_web3.js';

dotenv.config();

const apiKey = process.env.DEEP_SEEK_API;
const apiUrl = 'https://api.deepseek.com/v1/chat/completions';

async function generateAnswerrDeepSeek(answer: string, text?: string) {
	try {
		let prompt;
		if (answer == 'answer') {
			prompt = `
        Ответь на вопрос(на английском языке). Пиши от моего лица и не упоминай резюме.
        Мое резюме = ${cv}. 
        Вопрос = ${text}. 
        Верни результат в JSON. пример json: {answer:string}.
         `;
		} else if (answer == 'coverLetter') {
			prompt = `Мое резюме = ${cv}.
        Вакансия = ${text}.
        Сгенерируй cover letter(на английском языке) для вакансии. Пиши от моего лица и не упоминай резюме.
        Если в вакансии требуются навыки, которых нет в моем резюме, 
        то ничего об этом не пиши - делай акцент на моих навыках.
        Письмо раздели на блоки: hello, aboutMe, howMySkillsFitCompany, myPassiontToWorkInCompany, myContacts.
        Верни результат в JSON. пример json: {coverLetter:{hello:string, aboutMe:string, 
        howMySkillsFitCompany:string, myPassiontToWorkInCompany:string, myContacts:string }}.
         `;
		} else if (answer == 'numeric') {
			prompt = `
        Ответь на вопрос(только число).
        Мое резюме = ${cv}. 
        Вопрос = ${text}. (если вопрос о зарплате, то укажи 700.)
				Ответ должен быть только числом
        Верни результат в JSON. пример json: {answer:number}.
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

export { generateAnswerrDeepSeek };
