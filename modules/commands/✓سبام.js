const fs = require("fs-extra");
const path = require("path");

const warnsPath = path.join(__dirname, "cache", "warns.json");
const blacklistPath = path.join(__dirname, "seraBlacklist.js");

// وظيفة جلب الكلمات المحظورة بأمان
function getBlacklist() {
    try {
        if (fs.existsSync(blacklistPath)) {
            return require("./seraBlacklist").BLACK || [];
        }
        return [];
    } catch (e) { return []; }
}

function loadWarns() {
    if (!fs.existsSync(warnsPath)) fs.outputJsonSync(warnsPath, {});
    return fs.readJsonSync(warnsPath);
}

function saveWarns(data) {
    fs.outputJsonSync(warnsPath, data);
}

module.exports.config = {
    name: "سبام",
    version: "7.0.0",
    hasPermssion: 1,
    credits: "Ayman & Sera",
    description: "الرقابة الكارثية - حماية شاملة من السبام والكلمات البذيئة",
    commandCategory: "حماية",
    cooldowns: 0
};

module.exports.handleEvent = async ({ api, event, Users }) => {
    const { threadID, senderID, body, messageID } = event;
    if (!body || senderID == api.getCurrentUserID()) return;

    const DEV_ID = "61577861540407"; // أيديك يا زعيم
    if (senderID === DEV_ID) return;

    // 1. منع تكرار الحروف (تمطيط الكلام المزعج)
    if (/(.)\1{15,}/.test(body)) {
        api.unsendMessage(messageID);
        return api.sendMessage("🤫 سيرا تشان حذفت رسالتك.. بلاش تمطيط كلام!", threadID);
    }

    // 2. مكافحة سبام الإيموجي (طرد فوري)
    const emojis = body.match(/[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]/gu);
    if (emojis && emojis.length >= 10) {
        api.removeUserFromGroup(senderID, threadID);
        return api.sendMessage("🚫 طرد! ممنوع إغراق الشات بالإيموجيات.", threadID);
    }

    // 3. الرقابة على الكلمات المحظورة
    const BLACKLIST = getBlacklist();
    const cleanBody = body.toLowerCase().replace(/\s+/g, '');
    
    if (BLACKLIST.some(word => cleanBody.includes(word.toLowerCase()))) {
        let warns = loadWarns();
        if (!warns[threadID]) warns[threadID] = {};
        if (!warns[threadID][senderID]) warns[threadID][senderID] = 0;

        warns[threadID][senderID]++;
        saveWarns(warns);

        const count = warns[threadID][senderID];
        const name = await Users.getNameUser(senderID);

        if (count < 3) {
            api.unsendMessage(messageID);
            return api.sendMessage(`⚠️ تحذير [ ${count}/3 ] يا ${name}!\n──────────────────\nسيرا تشان لا تسمح بهذه الألفاظ هنا. احترم نفسك! 🐾`, threadID);
        } else {
            api.removeUserFromGroup(senderID, threadID);
            warns[threadID][senderID] = 0;
            saveWarns(warns);
            return api.sendMessage(`🚀 تم نفي ${name} خارج المجموعة لتجاوزه التحذيرات!`, threadID);
        }
    }
};

module.exports.run = async ({ api, event }) => {
    return api.sendMessage("🛡️ درع سيرا الكارثي نشط الآن لحمايتكم من التشويش والسبام.", event.threadID);
};
