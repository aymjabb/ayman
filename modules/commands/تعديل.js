const axios = require("axios");
const fs = require("fs");
const path = require("path");

const GEMINI_KEY = "AIzaSyALQBlieI5xur3yh0tT69MY36e353tBjuA";

module.exports.config = {
  name: "تعديل",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "anas",
  description: "تعديل / تحسين صورة باستخدام Gemini",
  commandCategory: "🖼️ صور",
  usages: "تعديل <وصف>",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (!event.messageReply || !event.messageReply.attachments[0])
      return api.sendMessage(
        "❌ رد على صورة واكتب وصف التعديل\nمثال:\nتعديل خليها أنمي",
        event.threadID,
        event.messageID
      );

    const prompt = args.join(" ");
    if (!prompt)
      return api.sendMessage("❌ اكتب وصف التعديل", event.threadID);

    const imgUrl = event.messageReply.attachments[0].url;
    const imgPath = path.join(__dirname, `/cache/${Date.now()}.jpg`);

    const imgData = await axios.get(imgUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(imgData.data));

    const base64Image = fs.readFileSync(imgPath, { encoding: "base64" });

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: `عدّل الصورة كالتالي:\n${prompt}` },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }
        ]
      }
    );

    const result =
      res.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "❌ لم يتمكن الذكاء من تعديل الصورة";

    fs.unlinkSync(imgPath);

    api.sendMessage(
      `✨ نتيجة التعديل:\n\n${result}`,
      event.threadID
    );

  } catch (err) {
    console.error(err);
    api.sendMessage(
      "⚠️ حصل خطأ أثناء تعديل الصورة\nتأكد من المفتاح أو الصورة",
      event.threadID
    );
  }
};
