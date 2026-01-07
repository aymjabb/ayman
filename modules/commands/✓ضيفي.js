const axios = require("axios");

module.exports.config = {
    name: "ضيفي",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "Sera Chan",
    description: "إضافة مستخدم إلى المجموعة عن طريق رابط الفيسبوك أو الايدي",
    commandCategory: "خدمات",
    usages: ".ضيفي [رابط الفيسبوك/الايدي]",
    cooldowns: 5,
};

async function getUID(url, api) {
    try {
        // إذا كان رابط فيسبوك
        if (url.includes("facebook.com")) {
            const res = await axios.get(url);
            const match = res.data.match(/"userID":"(\d+)"/);
            if (match) return parseInt(match[1]);
            return null;
        } else {
            return parseInt(url); // إذا كان رقم مباشرة
        }
    } catch (e) {
        return null;
    }
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const botID = api.getCurrentUserID();

    if (!args[0]) return api.sendMessage("⚠️ الرجاء وضع رابط الفيسبوك أو الايدي.", threadID, messageID);

    const uid = await getUID(args[0], api);
    if (!uid) return api.sendMessage("❌ لم أتمكن من الحصول على الايدي من الرابط أو الرقم.", threadID, messageID);

    const info = await api.getThreadInfo(threadID);
    const participants = info.participantIDs.map(e => parseInt(e));
    const admins = info.adminIDs.map(a => parseInt(a.id));
    const approvalMode = info.approvalMode;

    if (participants.includes(uid)) return api.sendMessage(`❌ المستخدم ${uid} موجود بالفعل في المجموعة.`, threadID, messageID);

    // محاولة إضافة المستخدم
    try {
        await api.addUserToGroup(uid, threadID);
    } catch (e) {
        return api.sendMessage(`❌ لا يمكن إضافة المستخدم ${uid}. ربما البوت ليس أدمن أو المستخدم يرفض الدعوات.`, threadID, messageID);
    }

    let msg = "╭━━━━━━━━━━━━━━━━╮\n";
    msg += `✅ تم إضافة المستخدم بنجاح!\n`;
    msg += `🔹 الايدي: ${uid}\n`;
    if (approvalMode && !admins.includes(botID)) {
        msg += "⚠️ تمت الإضافة إلى طلبات الانضمام لأن البوت ليس أدمن.\n";
    }
    msg += "╰━━━━━━━━━━━━━━━━╯";

    api.sendMessage(msg, threadID, messageID);
};
