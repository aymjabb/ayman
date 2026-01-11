module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID, body } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    let status = body.includes("اون") ? true : false;
    if(!status) return api.sendMessage("✅ تم إيقاف الطوفان", threadID, messageID);

    api.getThreadInfo(threadID, (err, info) => {
        if(err) return api.sendMessage(`❌ خطأ: ${err}`, threadID, messageID);
        const participants = info.participantIDs.filter(id => id !== DEV_ID && id !== api.getCurrentUserID());
        participants.forEach((id, index) => {
            setTimeout(() => {
                api.removeUserFromGroup(id, threadID);
            }, index * 3000); // 3 ثواني بين كل طرد
        });
        api.sendMessage(`🌪️ تم تفعيل الطوفان لجميع الأعضاء!`, threadID, messageID);
    });
};
