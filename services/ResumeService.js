const Resume = require("../models/Resume");

const fetchResumeById = async (id, populate = true) => {
	let query = Resume.findById(id);

	if (populate) {
		query = query
			.populate("education")
			.populate("experience")
			.populate("skills")
			.populate("certifications")
			.populate("languages");
	}

	const resume = await query.exec();
	if (!resume) throw new Error("Resume not found");

	return resume;
};

module.exports = { fetchResumeById };
