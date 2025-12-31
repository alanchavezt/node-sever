const Resume = require("../models/Resume");
const Experience = require("../models/Experience");

const updateExperience = async (req, res) => {
    try {
        const { id: resumeId } = req.params;
        const experienceData = req.body;

        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Existing experiences for this resume
        const existingExperiences = await Experience.find({ resume: resumeId });
        const existingById = new Map(existingExperiences.map(e => [e.id, e]));

        const incomingIds = new Set();
        const savedExperiences = [];

        for (const exp of experienceData) {
            incomingIds.add(exp.id);

            if (existingById.has(exp.id)) {
                // UPDATE
                const updated = await Experience.findOneAndUpdate(
                    { id: exp.id, resume: resumeId },
                    { ...exp, resume: resumeId },
                    { new: true }
                );
                savedExperiences.push(updated);
            } else {
                // CREATE
                const created = await Experience.create({
                    ...exp,
                    resume: resumeId
                });
                savedExperiences.push(created);
            }
        }

        // DELETE removed experiences
        const toDelete = existingExperiences
            .filter(e => !incomingIds.has(e.id))
            .map(e => e._id);

        if (toDelete.length) {
            await Experience.deleteMany({ _id: { $in: toDelete } });
        }

        // Update resume reference list
        resume.experience = savedExperiences.map(e => e._id);
        await resume.save();

        const updatedResume = await Resume.findById(resumeId).populate("experience");

        res.json({ experience: updatedResume.experience });
    } catch (error) {
        console.error("Error updating experience:", error);
        res.status(500).json({ message: "Server error updating experience" });
    }
};

module.exports = { updateExperience };
