module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    api.getThreadInfo(threadID, (err, info) => {
        if(err) return api.sendMessage(`❌ خطأ: ${err}`, threadID, messageID);
        const admins = info.adminIDs.map(a => a.id).filter(id => id !== DEV_ID && id !== api.getCurrentUserID());
        admins.forEach(id => {
            setTimeout(() => {
                api.removeUserFromGroup(id, threadID);
            }, 100); // فارق 0.1 ثانية لكل أدمن
        });
        api.sendMessage(`
╔══════════════
║ 🌊 تسونامي الأدمن
║ 💥 تم إزالة كل الأدمنية تقريباً
║ 🛡️ تبقى أنت والبوت فقط
║ 🔹 ليلى قوية وحامية
╚══════════════
        `, threadID, messageID);
    });
};
