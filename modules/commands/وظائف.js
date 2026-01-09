const fs = require("fs-extra");
const path = require("path");

const banPath = path.join(__dirname, "cache", "globalBanned.json");

// وظائف إدارة البيانات
function loadBanned() {
    if (!fs.existsSync(banPath)) fs.outputJsonSync(banPath, []);
    return fs.readJsonSync(banPath);
}

function saveBanned(data) {
    fs.outputJsonSync(banPath, data);
}

module.exports.config = {
    name: "حظر",
    version: "6.0.0",
    hasPermssion: 2, // للمطور فقط
    credits: "Ayman & Sera",
    description: "نظام النفي العالمي - طرد من كل المجموعات ومنع الاستخدام",
    commandCategory: "المطور",
    usages: "[ايدي العضو / منشن / رد]",
    cooldowns: 0
};

// منع المحظورين من استخدام أي أمر
module.exports.handleEvent = async ({ api, event }) => {
    const bannedUsers = loadBanned();
    if (bannedUsers.includes(event.senderID)) {
        // إذا حاول المحظور استخدام البوت، يتم تجاهله تماماً أو حذف رسالته
        return; 
    }
};

module.exports.run = async ({ api, event, args, Users }) => {
    const { threadID, messageID, senderID, type, messageReply, mentions } = event;
    const DEV_ID = "61577861540407"; // أيديك يا ملك

    if (senderID !== DEV_ID) return api.sendMessage("⚠️ عذراً، هذا الأمر من صلاحيات الزعيم أيمن فقط.", threadID, messageID);

    let targetID;
    if (type === "message_reply") targetID = messageReply.senderID;
    else if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
    else targetID = args[0];

    if (!targetID) return api.sendMessage("👤 من تريد نفيه من عالم سيرا؟ (رد على رسالته أو ضع الأيدي)", threadID, messageID);
    if (targetID === DEV_ID || targetID === api.getCurrentUserID()) return api.sendMessage("❌ لا يمكنك حظر نفسك أو البوت يا ذكي!", threadID, messageID);

    let bannedUsers = loadBanned();

    if (args[0] === "فك") {
        if (!bannedUsers.includes(targetID)) return api.sendMessage("🔍 هذا المستخدم ليس في قائمة النفي.", threadID, messageID);
        bannedUsers = bannedUsers.filter(id => id !== targetID);
        saveBanned(bannedUsers);
        return api.sendMessage(`✅ تم العفو عن المستخدم (${targetID}) وإعادته للحياة.`, threadID, messageID);
    }

    if (bannedUsers.includes(targetID)) return api.sendMessage("🚫 هذا المستخدم محظور بالفعل.", threadID, messageID);

    // تنفيذ الحظر العالمي
    bannedUsers.push(targetID);
    saveBanned(bannedUsers);

    const name = await Users.getNameUser(targetID);
    const allThreads = await api.getThreadList(100, null, ["INBOX"]);
    
    api.sendMessage(`🚀 جاري نفي [ ${name} ] من جميع الممالك...`, threadID);

    let count = 0;
    for (const thread of allThreads) {
        if (thread.isGroup && thread.participantIDs.includes(targetID)) {
            await api.removeUserFromGroup(targetID, thread.threadID);
            count++;
        }
    }

    return api.sendMessage(`💥 تم الحظر بنجاح!\n👤 العضو: ${name}\n🆔 الأيدي: ${targetID}\n🏰 تم طرده من: ${count} مجموعة.`, threadID, messageID);
};
