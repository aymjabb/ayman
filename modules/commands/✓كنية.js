
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "كنية",
    version: "1.2.0",
    hasPermssion: 1, // أدمن فقط
    credits: "عمر & Assistant",
    description: "تعيين كنية شخصية للعضو بالاسم، البلد، MBTI مع زخرفة",
    commandCategory: "مسؤولي المجموعات",
    usages: "كنية @العضو <الاسم> <البلد> <MBTI>",
    cooldowns: 5
};

module.exports.onLoad = () => {
    const pathData = path.join(__dirname, "cache", "user_nicknames.json");
    if (!fs.existsSync(pathData)) fs.writeFileSync(pathData, "{}", "utf-8");
};

module.exports.run = async function({ api, event, args, Users }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;
    const pathData = path.join(__dirname, "cache", "user_nicknames.json");
    const dataJson = JSON.parse(fs.readFileSync(pathData, "utf-8"));

    // التحقق من الأدمن
    const threadInfo = await api.getThreadInfo(threadID);
    const isAdmin = threadInfo.adminIDs.some(a => a.id == senderID);
    if (!isAdmin) return api.sendMessage("❌ فقط الأدمنز يمكنهم تعيين الكنية!", threadID, messageID);

    // اختيار العضو المستهدف (التاغ أو الرد)
    let targetID;
    if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
    } else if (messageReply && messageReply.senderID) {
        targetID = messageReply.senderID;
    } else return api.sendMessage("❌ الرجاء التاغ على العضو أو الرد على رسالته لتعيين الكنية!", threadID, messageID);

    // استخراج الاسم، البلد، MBTI
    if (args.length < 3) return api.sendMessage("❌ الرجاء كتابة الاسم + البلد + MBTI", threadID, messageID);
    const name = args[0];
    const country = args[1];
    const mbti = args.slice(2).join(" "); // لتسمح بالمسافات في MBTI إذا أحببت

    // زخرفة الكنية بالأقواس
    const nicknameDecorated = `【${name}】|【${country}】|【${mbti}】`;

    // حفظ الكنية
    if (!dataJson[threadID]) dataJson[threadID] = {};
    dataJson[threadID][targetID] = nicknameDecorated;
    fs.writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");

    const targetName = await Users.getNameUser(targetID);
    return api.sendMessage(`✅ تم تعيين كنية العضو: ${targetName}\n🌟 الكنية الجديدة: ${nicknameDecorated}`, threadID, messageID);
};

// مراقبة محاولة تغيير الكنية بدون إذن
module.exports.handleEvent = async function({ event }) {
    const { threadID, senderID } = event;
    const pathData = path.join(__dirname, "cache", "user_nicknames.json");
    const dataJson = JSON.parse(fs.readFileSync(pathData, "utf-8"));

    if (!dataJson[threadID] || !dataJson[threadID][senderID]) return;

    const nicknameOriginal = dataJson[threadID][senderID];
    const userData = await global.Users.getData(senderID);

    if (userData.name !== nicknameOriginal) {
        // إعادة الاسم للكنية الأصلية
        await global.Users.setData(senderID, { name: nicknameOriginal });
        const api = global.client.api;
        api.sendMessage(`😂 حاولت تغير كنيتك، بس سيرا تشان رجعتلك كنيتك الأصلية: ${nicknameOriginal}`, threadID);
    }
};
