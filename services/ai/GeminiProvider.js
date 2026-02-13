const { GoogleGenerativeAI } = require("@google/generative-ai");
const AIProvider = require("./AIProvider");

class GeminiProvider extends AIProvider {
	constructor() {
		super();

		if (!process.env.GEMINI_API_KEY) {
			throw new Error("Missing GEMINI_API_KEY");
		}

		this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

		// Recommended fast & cheap model
		this.model = this.genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
		});
	}

	async chat(messages, options = {}) {
		const temperature = options.temperature ?? 0.3;

		// Convert OpenAI-style messages → Gemini format
		const formattedPrompt = messages
			.map((m) => `${m.role.toUpperCase()}: ${m.content}`)
			.join("\n");

		const result = await this.model.generateContent({
			contents: [
				{
					role: "user",
					parts: [{ text: formattedPrompt }],
				},
			],
			generationConfig: {
				temperature,
			},
		});

		const response = await result.response;
		return response.text();
	}
}

module.exports = GeminiProvider;
