module.exports = function({ api, event }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID, body } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    let regex = /\.نبه\s+(.+)\s+(\d+)\s+(\d+)/i;
    let match = body.match(regex);
    if(!match) return api.sendMessage("❌ الصيغة: .نبه النص العدد الوقت", threadID, messageID);

    let text = match[1];
    let count = parseInt(match[2]);
    let minutes = parseInt(match[3]);

    for(let i = 0; i < count; i++) {
        setTimeout(() => {
            api.sendMessage(`⏰ تذكير: ${text}`, threadID);
        }, minutes*60000*i);
    }

    api.sendMessage(`✅ تم ضبط ${count} تذكيرات كل ${minutes} دقيقة`, threadID, messageID);
};
