const express = require("express");
const router = express.Router();
const { handleAIChat } = require("../../controllers/AIChatController");

router.post("/ai-chat", handleAIChat);

module.exports = router;
