const GeminiProvider = require("./GeminiProvider");
// const OpenAIProvider = require("./OpenAIProvider");

let provider;

if (process.env.AI_PROVIDER === "gemini") {
	provider = new GeminiProvider();
} else {
	throw new Error("Unsupported AI provider");
}

module.exports = provider;
