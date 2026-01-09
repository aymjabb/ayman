const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const GEMINI_KEY = "AIzaSyALQBlieI5xur3yh0tT69MY36e353tBjuA";

module.exports.config = {
  name: "تعديل",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "تعديل وتحسين الصور بذكاء سيرا تشان",
  commandCategory: "صور",
  usages: "رد على صورة واكتب (تعديل أنمي / كرتون / تحسين)",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  try {
    if (!messageReply || !messageReply.attachments || messageReply.attachments[0].type !== "photo") {
      return api.sendMessage(
        "🌸 سيرا تشان تنتظر! رد على صورة واكتب:\nتعديل أنمي\nتعديل كرتون\nتعديل تحسين",
        threadID,
        messageID
      );
    }

    const type = args[0];
    if (!type) return api.sendMessage("✨ أخبرني يا بطل، ما هو نوع التعديل الذي تريده؟", threadID, messageID);

    const imgUrl = messageReply.attachments[0].url;
    const imgPath = path.join(__dirname, `/cache/${Date.now()}.jpg`);

    // إشعار البدء
    api.sendMessage("⏳ لحظة.. سيرا تشان تقوم بلمساتها السحرية على الصورة ✨", threadID, messageID);

    const imgData = await axios.get(imgUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(imgData.data));
    const base64Image = fs.readFileSync(imgPath, { encoding: "base64" });

    // إعداد الطلب لـ Gemini بناءً على النوع
    let instruction = "";
    if (type.includes("أنمي")) instruction = "قم بوصف هذه الصورة بدقة وحولها في خيالك إلى أسلوب الأنمي الياباني الفخم.";
    else if (type.includes("كرتون")) instruction = "حول هذه الصورة إلى أسلوب الكرتون ثلاثي الأبعاد اللطيف.";
    else if (type.includes("تحسين")) instruction = "حلل جودة الصورة واقترح تحسينات بصرية واضحة لها.";
    else instruction = `نفذ التعديل التالي على الصورة: ${type}`;

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        contents: [{
          parts: [
            { text: instruction },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }]
      }
    );

    const result = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "🥺 عذراً، لم أستطع معالجة الصورة.";

    // تنظيف الكاش
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    const finalMsg = `
✨ نـتـيـجـة لـمـسـات سـيـرا الـفـنـيـة:
──────────────────
${result}
──────────────────
🐾 بـقـوة ذكـاء أيـمـن الـبـكـري
`;

    return api.sendMessage(finalMsg, threadID, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ عذراً، واجهت مشكلة في الاتصال بالذكاء الاصطناعي.", threadID, messageID);
  }
};
