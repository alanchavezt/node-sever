const aiProvider = require("../services/ai");
const resumeContext = require("../helpers/resumeContext");

const handleAIChat = async (req, res) => {
	try {
		const { messages } = req.body;

		if (!messages || !Array.isArray(messages)) {
			return res.status(400).json({ message: "Messages are required." });
		}

		const reply = await aiProvider.chat(
			[
				{ role: "system", content: resumeContext },
				...messages,
			],
			{ temperature: 0.3 }
		);

		res.json({ reply });

	} catch (err) {
		console.error("AI Chat Error:", err);
		res.status(500).json({ message: "AI service error." });
	}
};

module.exports = { handleAIChat };
