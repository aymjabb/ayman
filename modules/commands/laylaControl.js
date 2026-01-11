// صحصحي
module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID, body } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);
    if(!body.startsWith(".ليلى صحصحي")) return;

    api.sendMessage("✅ تم تفعيل البوت بالكامل! 🌸", threadID, messageID);
};

// نامي
module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID, body } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);
    if(!body.startsWith(".ليلى نامي")) return;

    api.sendMessage("🛑 تم إيقاف البوت عن استقبال أوامر المستخدمين 🌙", threadID, messageID);
};
