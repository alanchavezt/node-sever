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

		const systemMessage = messages.find(m => m.role === "system");

		const conversation = messages
			.filter(m => m.role !== "system")
			.map(m => ({
				role: m.role === "assistant" ? "model" : "user",
				parts: [{ text: m.content }],
			}));

		if (!conversation.length) {
			throw new Error("Conversation cannot be empty");
		}

		const response = await this.client.models.generateContent({
			model: this.model,
			contents: conversation,
			config: {
				temperature,
				systemInstruction: systemMessage?.content,
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
