const OpenAI = require("openai");
const resumeContext = require("../helpers/resumeContext");

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const handleAIChat = async (req, res) => {
	try {
		const { messages } = req.body;

		if (!messages || !Array.isArray(messages)) {
			return res.status(400).json({ message: "Messages are required." });
		}

		// v6 usage
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{ role: "system", content: resumeContext },
				...messages,
			],
			temperature: 0.3,
		});

		res.json({
			reply: completion.choices[0].message.content,
		});

	} catch (err) {
		// log full error to see network issues
		console.error("AI Chat Error:", err);
		res.status(500).json({ message: "AI service error." });
	}
};

module.exports = { handleAIChat };
