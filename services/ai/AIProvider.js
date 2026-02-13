class AIProvider {
	async chat(messages, options = {}) {
		throw new Error("chat() must be implemented");
	}
}

module.exports = AIProvider;
