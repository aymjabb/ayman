const { OpenAI } = require("openai");
const logger = require("../utils/logger");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function respondAI(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      max_tokens: 150,
    });
    return response.choices[0].message.content;
  } catch (err) {
    logger.error({ type: "openai_error", error: err });
    return null;
  }
}

module.exports = { respondAI };
