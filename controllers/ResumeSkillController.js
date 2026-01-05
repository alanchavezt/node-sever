const Skill = require("../models/Skill");
const Resume = require("../models/Resume");

const SKILL_LEVELS = require("../constants/skillLevels");

const updateSkills = async (req, res) => {
    try {
        const { id } = req.params; // resume id
        const skillsData = req.body; // array of skills, e.g. [{ skill: "JavaScript", level: "expert" }, ...]

        const resume = await Resume.findById(id);
        if (!resume) return res.status(404).json({ message: "Resume not found" });

        // Validate levels
        const invalidSkills = skillsData.filter(skill => !SKILL_LEVELS.includes(skill.level));
        if (invalidSkills.length > 0) {
            return res.status(400).json({
                message: "Invalid skill level(s) detected",
                invalidSkills
            });
        }

        // Remove old skills linked to this resume
        await Skill.deleteMany({ resume: id });

        // Create new skills
        const createdSkills = await Skill.insertMany(
            skillsData.map(skill => ({ ...skill, resume: id }))
        );

        // Update resume with new skill references
        resume.skills = createdSkills.map(skill => skill._id);
        await resume.save();

        res.json({ skills: createdSkills });
    } catch (error) {
        console.error("Error updating skills:", error);
        res.status(500).json({ message: "Failed to update skills" });
    }
};

module.exports = { updateSkills };
