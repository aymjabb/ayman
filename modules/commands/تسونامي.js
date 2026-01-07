const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "تسونامي",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "Sera Chan",
    description: "تفعيل البوت للرد والانضمام للمجموعات (خاص بالمطور)",
    commandCategory: "system",
    usages: ".تسونامي",
    cooldowns: 3
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, senderID } = event;
    const DEV = ["61577861540407"]; // ID المطور

    if (!DEV.includes(senderID)) {
        return api.sendMessage("❌ هذا الأمر مخصص للمطور فقط!", threadID, messageID);
    }

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const statusPath = path.join(cacheDir, "bot_control.json");

    // إنشاء الملف أو تحديثه
    fs.writeFileSync(statusPath, JSON.stringify({ active: true }, null, 2), "utf-8");

    return api.sendMessage("🌊✅ تم تفعيل البوت! الآن يمكنه الرد والانضمام للمجموعات.", threadID, messageID);
};
