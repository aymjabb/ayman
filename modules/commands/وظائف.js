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
    version: "6.1.0",
    hasPermssion: 2, // للمطور فقط
    credits: "Ayman & Sera",
    description: "نظام النفي العالمي - طرد من كل المجموعات ومنع الاستخدام",
    commandCategory: "المطور",
    usages: "[ايدي العضو / منشن / رد] أو حظر فك [ايدي]",
    cooldowns: 0
};

// منع المحظورين من استخدام أي أمر
module.exports.handleEvent = async ({ event }) => {
    const bannedUsers = loadBanned();
    if (bannedUsers.includes(event.senderID)) {
        // يمكن إضافة حذف الرسالة أو تجاهلها
        return;
    }
};

module.exports.run = async ({ api, event, args, Users }) => {
    const { threadID, messageID, senderID, type, messageReply, mentions } = event;
    const DEV_ID = "61577861540407"; // أيديك يا ملك
    const BOT_ID = api.getCurrentUserID();

    if (senderID !== DEV_ID) 
        return api.sendMessage("⚠️ عذراً، هذا الأمر من صلاحيات الزعيم أيمن فقط.", threadID, messageID);

    let targetID;

    if (args[0] === "فك") {
        // فك الحظر
        targetID = args[1] || (type === "message_reply" ? messageReply.senderID : Object.keys(mentions)[0]);
        if (!targetID) return api.sendMessage("👤 حدد المستخدم لفك الحظر (رد أو منشن أو ايدي).", threadID, messageID);

        let bannedUsers = loadBanned();
        if (!bannedUsers.includes(targetID)) 
            return api.sendMessage("🔍 هذا المستخدم ليس في قائمة الحظر.", threadID, messageID);

        bannedUsers = bannedUsers.filter(id => id !== targetID);
        saveBanned(bannedUsers);
        return api.sendMessage(`✅ تم رفع الحظر عن المستخدم (${targetID}) وإعادته للحياة.`, threadID, messageID);
    }

    // حظر جديد
    if (type === "message_reply") targetID = messageReply.senderID;
    else if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
    else targetID = args[0];

    if (!targetID) return api.sendMessage("👤 حدد المستخدم للحظر (رد أو منشن أو ايدي).", threadID, messageID);
    if (targetID === DEV_ID || targetID === BOT_ID) 
        return api.sendMessage("❌ لا يمكنك حظر المطور أو البوت!", threadID, messageID);

    let bannedUsers = loadBanned();
    if (bannedUsers.includes(targetID)) 
        return api.sendMessage("🚫 هذا المستخدم محظور بالفعل.", threadID, messageID);

    bannedUsers.push(targetID);
    saveBanned(bannedUsers);

    const name = await Users.getNameUser(targetID);
    const allThreads = await api.getThreadList(100, null, ["INBOX"]);

    api.sendMessage(`🚀 جاري حظر [ ${name} ] من جميع الممالك...`, threadID);

    let count = 0;
    for (const thread of allThreads) {
        if (thread.isGroup && thread.participantIDs.includes(targetID)) {
            try {
                await api.removeUserFromGroup(targetID, thread.threadID);
                count++;
                await new Promise(r => setTimeout(r, 1000)); // تأخير بسيط لتجنب الحظر من فيسبوك
            } catch (e) {
                console.error(`❌ فشل طرد ${targetID} من المجموعة ${thread.threadID}`);
            }
        }
    }

    return api.sendMessage(
        `💥 تم الحظر بنجاح!\n──────────────────\n` +
        `👤 العضو: ${name}\n` +
        `🆔 الأيدي: ${targetID}\n` +
        `🏰 تم طرده من: ${count} مجموعة\n──────────────────\n` +
        `🐾 قوة سيرا تشان!`,
        threadID, messageID
    );
};
