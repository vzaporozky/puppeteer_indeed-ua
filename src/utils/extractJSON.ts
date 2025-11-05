function extractJson(response) {
	const responseData = response.data.choices[0].message.content;

	const jsonMatch = responseData.match(/```json\s*([\s\S]*?)\s*```/);
	let jsonString;

	if (jsonMatch) {
		jsonString = jsonMatch[1];
	} else {
		const braceMatch = responseData.match(/{[\s\S]*}/);
		if (braceMatch) {
			jsonString = braceMatch[0];
		} else {
			throw new Error('JSON not found in response');
		}
	}

	try {
		return JSON.parse(jsonString);
	} catch (e) {
		try {
			jsonString = jsonString.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
			return JSON.parse(jsonString);
		} catch (e2) {
			console.log('Failed to parse JSON. Heres what came:\n', jsonString);
			throw e2;
		}
	}
}

export { extractJson };
