const fs = require('fs');

module.exports.config = {
    name: "ايقاف",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "سيرا تشان",
    description: "إيقاف البوت عن الرد على المستخدمين العاديين، يرد فقط على المطور",
    commandCategory: "system",
    usages: "ايقاف",
    cooldowns: 3
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, senderID } = event;
    const developers = ["61577861540407"]; // أضف هنا ID المطورين المصرح لهم

    // التحقق من صلاحية المطور فقط
    if (!developers.includes(senderID)) {
        return api.sendMessage("⚠️ هذا الأمر مخصص للمطور فقط!", threadID, messageID);
    }

    const statusPath = './modules/commands/cache/bot_status.json';

    // إنشاء الملف لو غير موجود
    if (!fs.existsSync(statusPath)) {
        fs.writeFileSync(statusPath, JSON.stringify({ status: "active" }, null, 2));
    }

    // تعيين حالة البوت على متوقف
    const botStatus = { status: "inactive" };
    fs.writeFileSync(statusPath, JSON.stringify(botStatus, null, 2));

    return api.sendMessage("🔴 تم إيقاف البوت عن الرد على المستخدمين العاديين!\n✅ البوت سيرد على المطور فقط", threadID, messageID);
};
