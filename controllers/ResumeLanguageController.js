const Language = require("../models/Language");
const Resume = require("../models/Resume");

const LANGUAGE_PROFICIENCY_LEVELS = require("../constants/languageProficiency")

const updateLanguages = async (req, res) => {
    try {
        const { id } = req.params; // resume id
        const languagesData = req.body;

        if (!Array.isArray(languagesData)) {
            return res.status(400).json({
                message: "Languages must be an array"
            });
        }

        const resume = await Resume.findById(id);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Validate languages before DB mutation
        for (const lang of languagesData) {
            if (!lang.name || typeof lang.name !== "string") {
                return res.status(400).json({
                    message: "Each language must have a valid name"
                });
            }

            if (
                !lang.proficiency ||
                !LANGUAGE_PROFICIENCY_LEVELS.includes(lang.proficiency)
            ) {
                return res.status(400).json({
                    message: `Invalid language proficiency: ${lang.proficiency}`,
                    allowedValues: LANGUAGE_PROFICIENCY_LEVELS
                });
            }
        }

        // Remove old languages linked to this resume
        await Language.deleteMany({ resume: id });

        // Create new languages
        const createdLanguages = await Language.insertMany(
            languagesData.map(lang => ({
                name: lang.name.trim(),
                proficiency: lang.proficiency,
                resume: id
            }))
        );

        // Update resume with new language references
        resume.languages = createdLanguages.map(lang => lang._id);
        await resume.save();

        res.json({ languages: createdLanguages });
    } catch (error) {
        console.error("Error updating languages:", error);
        res.status(500).json({ message: "Failed to update languages" });
    }
};

module.exports = { updateLanguages };
