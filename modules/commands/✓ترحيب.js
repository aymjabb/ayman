const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "ترحيب",
  version: "1.0.1",
  hasPermssion: 1, // للأدمن والمطور
  credits: "Ayman & Sera",
  description: "الترحيب بالأعضاء الجدد بصورتهم الشخصية",
  commandCategory: "نظام",
  cooldowns: 0
};

module.exports.handleEvent = async ({ api, event, Users }) => {
  const { threadID, logMessageType, logMessageData } = event;

  // التحقق من انضمام عضو جديد
  if (logMessageType === "log:subscribe") {
    const newParticipant = logMessageData.addedParticipants[0];
    const userID = newParticipant.userID;
    const name = await Users.getNameUser(userID);

    // تجنب الترحيب بالنفس (البوت)
    if (userID !== api.getCurrentUserID()) {
      // رابط صورة العضو الشخصية بجودة عالية
      const avatarURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const imgPath = path.join(__dirname, "cache", `welcome_${userID}.jpg`);

      try {
        // تحميل الصورة
        const res = await axios.get(avatarURL, { responseType: "arraybuffer" });
        fs.outputFileSync(imgPath, Buffer.from(res.data));

        // رسالة الترحيب
        const welcomeMsg = `
✨ أهـلاً بـك فـي عـالـمـنـا يا [ ${name} ] ✨
────────────────────────────
🛡️ نـورت الـكـروب بـانـضـمـامـك!
📜 الرجاء الالتزام بالقوانين لتجنب الطرد.
💬 تـفـاعـل لتصبح من الملوك وتصعد في الترتيب.

🐾 مـع تـحـيـات: سـيـرا تـشـان والـمـطـور أيـمـن
────────────────────────────
        `;

        // إرسال الرسالة مع الصورة
        return api.sendMessage({
          body: welcomeMsg,
          attachment: fs.createReadStream(imgPath)
        }, threadID, () => {
          // حذف الصورة بعد الإرسال لتوفير المساحة
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        });

      } catch (error) {
        console.error("خطأ أثناء جلب صورة الترحيب:", error);
        // إرسال رسالة نصية بسيطة إذا فشل تحميل الصورة
        return api.sendMessage(`✨ أهلاً بك يا ${name} في مجموعتنا! نورتنا 🐾`, threadID);
      }
    }
  }
};

// رسالة عند استخدام الأمر يدوياً (اختياري)
module.exports.run = async ({ api, event }) => {
  return api.sendMessage(
    "⚙️ نظام الترحيب يعمل تلقائياً عند انضمام أي عضو جديد! 🐾", 
    event.threadID
  );
};
