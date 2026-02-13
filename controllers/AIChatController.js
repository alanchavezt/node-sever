const aiProvider = require("../services/ai");
const { fetchResumeById } = require("../services/resumeService");

const REQUIRED_REFUSAL = "I'm sorry, I can only answer questions related to the provided resume.";

const handleAIChat = async (req, res) => {
	try {
		const { messages, resumeId } = req.body;

		if (!messages || !Array.isArray(messages)) {
			return res.status(400).json({ message: "Messages are required." });
		}

		if (!resumeId) return res.status(400).json({ message: "resumeId is required." });

		const resumeDoc = await fetchResumeById(resumeId);

		const strictContext = `
			You are an AI assistant that ONLY answers questions related to the following resume.
			
			Rules:
			- If the question is NOT strictly related to the resume, respond EXACTLY with:
			"${REQUIRED_REFUSAL}"
			- Do NOT add anything else.
			- Do NOT explain.
			- Do NOT apologize differently.
			- Do NOT provide additional context.
			- Do NOT answer general knowledge questions.
			- Do NOT make up information.
			
			Resume:
			${JSON.stringify(resumeDoc)}
		`.trim();

		const reply = await aiProvider.chat(
			[{ role: "system", content: strictContext }, ...messages],
			{ temperature: 0.2 }
		);

		let finalReply = reply?.trim() || "";

		if (finalReply.toLowerCase().includes("only answer questions related") && finalReply !== REQUIRED_REFUSAL) {
			finalReply = REQUIRED_REFUSAL;
		}

		res.json({ reply: finalReply });

	} catch (err) {
		console.error("AI Chat Error:", err);

		res.status(500).json({
			message: "AI service error.",
			error: process.env.NODE_ENV === "development" ? err.message : undefined,
		});
	}
};

module.exports = { handleAIChat };
