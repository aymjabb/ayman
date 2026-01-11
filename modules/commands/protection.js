module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID, body } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    let status = body.includes("اون") ? true : false;
    let threadData = global.data.threadData.get(threadID) || {};
    threadData.adminProtect = status;
    global.data.threadData.set(threadID, threadData);

    api.sendMessage(`
╔══════════════
║ 🛡️ حماية الأدمن
║ 💫 الوضع: ${status ? "مفعل" : "معطل"}
║ 🔹 يمنع أي شخص من أن يصبح أدمن بدون إذنك
║ 🔹 يحمي كل الأدمنية الحالية
║ 🌟 ليلى تحميك يا مطوري العزيز
╚══════════════
    `, threadID, messageID);
};
