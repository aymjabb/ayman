module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    api.sendMessage("🔄 جاري إعادة تشغيل البوت...", threadID, messageID, () => {
        process.exit(1);
    });
};
