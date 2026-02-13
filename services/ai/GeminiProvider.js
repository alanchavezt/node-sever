const { GoogleGenAI } = require("@google/genai");
const AIProvider = require("./AIProvider");

class GeminiProvider extends AIProvider {
	constructor() {
		super();

		if (!process.env.GOOGLE_API_KEY) {
			throw new Error("Missing GOOGLE_API_KEY");
		}

		this.client = new GoogleGenAI({
			apiKey: process.env.GOOGLE_API_KEY,
		});

		this.model = "gemini-2.5-flash";
	}

	async chat(messages, options = {}) {
		const temperature = options.temperature ?? 0.3;

		const prompt = messages
			.map((m) => `${m.role.toUpperCase()}: ${m.content}`)
			.join("\n");

		const response = await this.client.models.generateContent({
			model: this.model,
			contents: [
				{
					role: "user",
					parts: [{ text: prompt }],
				},
			],
			config: {
				temperature,
			},
		});

		return (
			response.output_text ??
			response.candidates?.[0]?.content?.parts?.[0]?.text ??
			""
		);
	}
}

module.exports = GeminiProvider;
