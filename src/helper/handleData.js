import { API_BASE } from "../constants/api";

export async function fetchData(
	url,
	method = "GET",
	body = null,
	callBack = null,
	maxRetries = 3
) {
	let attempts = 0;
	while (attempts < maxRetries) {
		attempts++;
		const options = {
			method,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		};
		if (body) options.body = JSON.stringify(body);
		try {
			const response = await fetch(`${API_BASE}/api/${url}`, options);
			if (response.status === 400) {
				console.warn(
					`Retrying request (${attempts}/${maxRetries}) for ${url} due to 400 response.`
				);
				await new Promise(resolve => setTimeout(resolve, 2000));
				continue;
			}
			const data = await response.json();
			if (!data) return;
			if (callBack) callBack(data);
			return;
		} catch (err) {
			console.error(`Error fetching ${url}:`, err);
		}
	}
	console.error(`Max retries reached for ${url}.`);
}
