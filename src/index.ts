const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

import fs from 'fs';
import scrape from './core/scrape.js';
import apply from './core/apply.js';
import { login } from './core/login.js';
import { fillDetails } from './core/fillDetails.js';
import { closeAskNotify } from './utils/closeAskNotify.js';

const delay = ms => new Promise(res => setTimeout(res, ms));

const userAgents = [
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
];

function getRandomUserAgent() {
	return userAgents[Math.floor(Math.random() * userAgents.length)];
}

(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: null,
	});
	const page = await browser.newPage();
	const randomUA = getRandomUserAgent();
	await page.setUserAgent(randomUA);
	await page.setViewport({
		width: Math.floor(1024 + Math.random() * 100),
		height: Math.floor(768 + Math.random() * 100),
	});

	await page.goto('https://ua.indeed.com');

	// await delay(30000);

	await delay(1000);

	await login(browser, page);
	await delay(3000);

	await fillDetails(page);
	// await delay(3000);

	// await closeAskNotify(page);

	// https://ua.indeed.com/jobs?q=full%20stack%20developer&l=%D0%A3%D0%BA%D1%80%D0%B0%D0%B8%D0%BD%D0%B0&sort=date
	// https://ua.indeed.com/jobs?q=full+stack+developer&l=%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F+%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0&from=searchOnDesktopSerp%2Cwhereautocomplete&cf-turnstile-response=0.B9Jyq24cgK4lKLl7t9rwyBu9545L1PTyFOTXY8Ek7BWwUuWLc642N6myJTK7vA3OCGKHZc-pEVAuAN8t4UUqe5kPNKx1CL4OyJNtDI-bY3Q-vUdU-YowUQOCh-EV2WUFSfNm1rGgY3dokZGuTF5bPJocyEgzxQ5Ofe5rEBWYEY37KxofAqylnhl1PZsodmzJl3B5Ph4Mou5coGduopazJIhZVCcmd2orBQTWqrpG3eT-5c9n3EPYdmq4EPFUNL_A_OzetA-sjtZFlYsxDSLDW9ttgJN9V_CMKjXkB5BtmSySjxvq-rbeXXNTtXyTVrXG29nTba40XN1spJp-VpkT6JekcwQ1uFEHAjMF-IyB6xyStqfvYq28Ala0e53JFvEm1npP4heChR6yMGlmLPkkbLqCr4oXNAu6cUiPnKTZ209qxYli6nmvpwIYMrUtsmjH7SmrgodFX7cS1SNFePerAXC6Tq6KBcbHRWlaOxOOMBtUoD1_96En7JE1PsFIWBQxlAnRV5vttIk6aJNgMtpbAiUwSqt5XcmHSzOSW7Pak7nLwsRtbOsQDcfMK5ihLBKlOcap6DUDZcP_WwVflce-3neE0aYM4tCZC_VgBkA0_6TP8xExjqOOt8PueBVVS_k-nETAHZXVEHyZM7hLiXW4dQBlLilFgdN6cA3-AZk5XB23RBg_Pr49xRbqXQFIj3bAuzUiHdRzOHZlLJRL7G_tx9DNPwQAwpyEmUNskYkAAF-mndRolsoG1S3D_2Y7cnJZzMsOnLXcS5uSYhmgtynKTYsPUF-8jvh4TCl9c9Rplnb08Msu4YAxmfH1kCing9ZY26hMqIzN3QVqTqVF_J98uE7RC6UEUdOyAX8Y0eIT-8tG76OAla8fq2aRRfDN8ODHd4qpXHNXlNMA14Ni8Gp_IQ.3hlMlav3qgAMyDHB_w-QEQ.2f8ca0243c34070bb99a62a828bbe993c9b486b6573d1a5a136d8440fb961f12&vjk=c6733e9545845869
	// https://pl.indeed.com/jobs?q=full+stack+developer&l=zdalnie&from=searchOnDesktopSerp%2Cwhereautocomplete&cf-turnstile-response=0.-AqrS457lwQcqx8-aG5rqKzA9q4cVyi3kLvsPbJZ47bal0B4XDihhM4ADY7XQsUrwG1GP8wziUxXHcRiNY9VbtTpVAiLaDTPkY0tI9R0e8lww90wWbv6j2jYXMbmSN3fKYqdu25e0t59JdGjbHt0gs382pItwObnsfZMhjIduFAn8CSR8ilOq9CSHaKCV0dshEE2TsdcOJQL8wPeqQyGXq-1YB5t4eQxiTU22a7VREbJAK3uiqlLMaVg9hyGXP6TuTF-yKuQYB9QkWHgQvapciKnHj5mZtz526VYP_5UYzUz-bTFCVYnGpJBKpud2bFRJwpxZBFrjHeoKr0zcKsZKsqiNVEC6lsYsNGxRww-mWUGINgrIT8CkAYTp6YEl0M5uL5GoCVkcAdLEthk4HNZnBcCDHvRvqE9EDpliX7BnJ5NtvABQrgOVSSzfJqQ0QXCEjW_dAP0bQLhuF-S89z1oK6iglF_bLPqLxrr2i0L7F3LLt-sp6HTnRCvu8HRZZA0_mZrCJ20cuVPEzTqGNFuJVbshqY3kOuBqpcu8rKEt4Fp3VPgPXhDePG7hlZhiyN2D15suiv-mW8WuRBg_4HXDKIzS5OhcHoW583PwJZz5r8Lv6cUXi87kO5-bw5Rm0T6jHn8ARmA-qHlAmckSef9rMkjq44V-TWEyYO8BN9Sa1koRrTB_UT-mlUUecXjiFS1lmRl7pyEi2ZuSO8SHqDD8ipgmezmkUeIpW4SpEJeygEIf6TX9b27G1GKg8sEXpYUrNO4UgnpQmTZPHe5du6iNxywMf3xrpERM6pVOLEaLnFdZiSUOUzGSrn7n1dt6tnyqdJBcAnFsZ05RmRRAIe1Z7InczNxwNyCmgC4_6GlpYLf8G6rmjUIjJh17gjeWJBBPg27GcsveauvfWsaPkmapw.6g7C4VVJQ4xmpg_YQKQvHA.5bbce3c013fef7556b05c95dbd3af1385e5dd169f3353606ce6bc269b21484b8&vjk=26883689b305d1fb

	const jobs_test = [
		// 'https://ua.indeed.com/rc/clk?jk=e57a981ac5b39e2b&bb=7jZtQMgHAZDON0-ojOIvjUz7Q_VWjE6NP5cRSE_M1qAHLiUNC8uNxr6tlahLpAfc9pbQTQnGrj0evcBEFhOO4-mzl8pCsYJyIhrL6If_XhrAj4VeND1CNyzfo0kvtarfFcEQjO_16djTwlAY_lAb3D2rbjQUKPug&xkcb=SoAq67M3rvy2OvTN8B0LbzkdCdPP&fccid=ee5c2d7138353951&vjs=3',
		'https://ua.indeed.com/viewjob?jk=f3918eeb346e3669&tk=1j9hgtrakha9h805&from=hp&xpse=SoBh67I3rxqLd9zNSx0LbzkdCdPP&xfps=1c967b38-18b8-4e84-a2b8-7038632efdca&xkcb=SoA767M3rxp4rnzBIh0LbzkdCdPP',
		// 'https://ua.indeed.com/?r=us&vjk=7bd7517a2ea8dc0d',
		// 'https://ua.indeed.com/?r=us&vjk=9a62e02cfc17c6a4',
	];

	// console.log('before jobs');
	// const jobs = await scrape(page);

	// console.log(jobs);

	console.log('before apply');
	await apply(browser, jobs_test);

	/////// возможно будут проблемы с тем, что максимальное кол-во символов будет ограничено
	////// тогда нужно будет сделать ограничение для ИИ (в промпте)

	await browser.close();
})();
