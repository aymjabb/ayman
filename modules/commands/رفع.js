const axios = require("axios");

module.exports.config = {
  name: "رفع",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "رفع الصور والحصول على رابط مباشر",
  commandCategory: "أدوات",
  usages: "قم بالرد على صورة بكلمة [رفع]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, messageReply } = event;

  // تحقق من الرد
  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage(
      "✨ يجب أن ترد على صورة لكي أرفعها لك.",
      threadID,
      messageID
    );
  }

  const attachment = messageReply.attachments[0];

  // تحقق من نوع المرفق
  if (attachment.type !== "photo" || !attachment.url) {
    return api.sendMessage(
      "❌ هذا الأمر مخصص لرفع الصور فقط.",
      threadID,
      messageID
    );
  }

  const imgUrl = attachment.url;

  try {
    await api.sendMessage(
      "⏳ جاري رفع الصورة.. انتظر قليلًا ✨",
      threadID,
      messageID
    );

    // رفع الصورة عبر ImgBB (أكثر استقرارًا من Imgur مع البوتات)
    const res = await axios.get(
      "https://api.imgbb.com/1/upload",
      {
        params: {
          key: "63004313f8c0a379f88c8236267f1395",
          image: imgUrl
        },
        timeout: 20000
      }
    );

    if (!res.data || !res.data.data || !res.data.data.url) {
      throw new Error("استجابة غير صالحة من API");
    }

    const directLink = res.data.data.url;

    const msg =
`✅ تـم الـرفـع بـنـجـاح!
──────────────────
🔗 الـرابـط الـمـبـاشـر:
${directLink}
──────────────────
🐾 بـقـوة سـيـرا تـشـان`;

    return api.sendMessage(msg, threadID, messageID);

  } catch (err) {
    console.error("خطأ الرفع:", err.message);
    return api.sendMessage(
      "💔 فشل رفع الصورة.\nقد يكون الرابط منتهي أو الخدمة مشغولة.",
      threadID,
      messageID
    );
  }
};
