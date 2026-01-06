const fs = require('fs');

module.exports.config = {
    name: "تشغيل",
    version: "1.0.0",
    hasPermssion: 2, // صلاحية مطور فقط
    credits: "سيرا تشان",
    description: "تشغيل البوت للرد على جميع المستخدمين (للمطور فقط)",
    commandCategory: "system",
    usages: "تشغيل",
    cooldowns: 3,
    usePrefix: false
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    // الايديه الخاص بالمطور فقط
    const DEV = ["61577861540407"]; // غيرها إلى الايدي الخاص بك إذا تغير
    
    if (!DEV.includes(senderID)) {
        return api.sendMessage("❌ هذا الأمر للمطور فقط! 🐾 سيرا تشان تمنعك من التشغيل", threadID, messageID);
    }
    
    const statusPath = './modules/commands/cache/bot_status.json';
    
    // إنشاء الملف إذا لم يكن موجوداً
    if (!fs.existsSync(statusPath)) {
        fs.writeFileSync(statusPath, JSON.stringify({ status: "inactive" }, null, 2));
    }
    
    // تغيير حالة البوت إلى active
    let botStatus = { status: "active" };
    fs.writeFileSync(statusPath, JSON.stringify(botStatus, null, 2));
    
    // رسالة مزخرفة وجذابة
    const message = `
🟢 ░۩۞۩░ البوت شغّال ░۩۞۩░ 🟢

⚡ تم تشغيل البوت للرد على جميع المستخدمين
🛡️ المطور فقط قادر على التحكم
🌟 سيرا تشان تحمي المجموعة ✨
`;

    return api.sendMessage(message, threadID, messageID);
};
