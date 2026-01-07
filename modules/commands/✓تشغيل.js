const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "تشغيل",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "سيرا تشان",
    description: "تشغيل البوت للرد على جميع المستخدمين (للمطور فقط)",
    commandCategory: "system",
    usages: "تشغيل",
    cooldowns: 3
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, senderID } = event;
    const DEV = ["61577861540407"];

    if (!DEV.includes(senderID)) 
        return api.sendMessage("❌ هذا الأمر للمطور فقط!", threadID, messageID);

    const statusPath = path.join(__dirname, "cache/bot_status.json");

    // إنشاء الملف إذا لم يكن موجود
    if (!fs.existsSync(path.dirname(statusPath))) fs.mkdirSync(path.dirname(statusPath), { recursive: true });
    if (!fs.existsSync(statusPath)) fs.writeFileSync(statusPath, JSON.stringify({ status: "inactive" }, null, 2));

    // تعيين الحالة عالمياً وتشغيل البوت
    global.botStatus = { status: "active" };
    fs.writeFileSync(statusPath, JSON.stringify(global.botStatus, null, 2));

    const msg = `
🟢 ░۩۞۩░ البوت شغّال ░۩۞۩░ 🟢

⚡ تم تشغيل البوت للرد على جميع المستخدمين
🛡️ المطور فقط قادر على التحكم
🌟 سيرا تشان تحمي المجموعة ✨
`;

    return api.sendMessage(msg, threadID, messageID);
};
