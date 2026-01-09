const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "ترحيب",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Ayman & Sera",
  description: "الترحيب بالأعضاء الجدد بصورتهم الشخصية",
  commandCategory: "نظام",
  cooldowns: 0
};

module.exports.handleEvent = async ({ api, event, Users }) => {
  const { threadID, logMessageType, logMessageData } = event;

  // التحقق من انضمام عضو جديد
  if (logMessageType === "log:subscribe") {
    const newNode = logMessageData.addedParticipants[0];
    const userID = newNode.userID;
    const name = await Users.getNameUser(userID);

    if (userID !== api.getCurrentUserID()) {
      // رابط صورة العضو الشخصية بجودة عالية
      const avatarURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const imgPath = path.join(__dirname, "cache", `welcome_${userID}.jpg`);

      try {
        const res = await axios.get(avatarURL, { responseType: "arraybuffer" });
        fs.outputFileSync(imgPath, Buffer.from(res.data));

        const welcomeMsg = `
✨ أهـلاً بـك فـي عـالـمـنـا يـا [ ${name} ] ✨
──────────────────
🛡️ نـورت الـكـروب بـانـضـمـامـك!
📜 نـرجـو مـنـك الـتـزام الـقـوانـيـن لـتـجـنـب الـطرد.
💬 تـفـاعـل لـتـصـبـح مـن الـمـلـوك وتـصـعـد فـي الـتـرتـيـب.

🐾 مـع تـحـيـات: سـيـرا تـشـان والـمـطـور أيـمـن
──────────────────
        `;

        return api.sendMessage({
          body: welcomeMsg,
          attachment: fs.createReadStream(imgPath)
        }, threadID, () => {
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        });

      } catch (e) {
        return api.sendMessage(`✨ أهلاً بك يا ${name} في مجموعتنا! نورتنا 🐾`, threadID);
      }
    }
  }
};

module.exports.run = async ({ api, event }) => {
  return api.sendMessage("⚙️ هذا النظام يعمل تلقائياً عند انضمام أي عضو جديد!", event.threadID);
};
