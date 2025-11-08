import { ElementHandle, Page } from 'puppeteer-core';

const defineType = async (elem: ElementHandle<Element>) => {
	const text = elem.$('input[type="text"]');
	if (text) return { elem: text, type: 'text' };

	const select = elem.$('select');
	if (select) return { elem: select, type: 'select' };

	const radio = elem.$('input[type="radio"]');
	if (radio) return { elem: radio, type: 'radio' };

	const checkbox = elem.$('input[type="checkbox"]');
	if (checkbox) return { elem: checkbox, type: 'checkbox' };

	return null;
};
export { defineType };
