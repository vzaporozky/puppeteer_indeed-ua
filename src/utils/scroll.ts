export const scroll = async (): Promise<void> => {
	const scrollStep = 200;
	const delay = 50;

	for (let i = 0; i < document.body.scrollHeight; i += scrollStep) {
		window.scrollBy(0, scrollStep);
		await new Promise(r => setTimeout(r, delay));
	}
};
