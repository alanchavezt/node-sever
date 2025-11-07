const Language = require("../models/Language");
const Resume = require("../models/Resume");

const updateLanguages = async (req, res) => {
    try {
        const { id } = req.params; // resume id
        const languagesData = req.body; // array of languages

        const resume = await Resume.findById(id);
        if (!resume) return res.status(404).json({ message: "Resume not found" });

        // Remove old languages linked to this resume
        await Language.deleteMany({ resume: id });

        // Create new languages
        const createdLanguages = await Language.insertMany(
            languagesData.map(lang => ({ ...lang, resume: id }))
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
