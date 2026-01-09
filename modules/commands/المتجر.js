const fs = require("fs-extra");
const path = require("path");

const cacheDir = path.join(__dirname, "cache");
const scoresPath = path.join(cacheDir, "topPlayer.json");

// ===== وظائف مساعدة =====
function loadData() {
    try {
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
        if (!fs.existsSync(scoresPath)) fs.writeJsonSync(scoresPath, {});
        return fs.readJsonSync(scoresPath);
    } catch (err) {
        console.error("خطأ تحميل البيانات:", err);
        return {};
    }
}

function saveData(data) {
    try {
        fs.writeJsonSync(scoresPath, data, { spaces: 2 });
    } catch (err) {
        console.error("خطأ حفظ البيانات:", err);
    }
}

// ===== إعدادات الأمر =====
module.exports.config = {
    name: "متجر",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Ayman",
    description: "متجر لشراء مميزات بنقاط المسابقات",
    commandCategory: "ترفيه",
    cooldowns: 5
};

// ===== تنفيذ الأمر =====
module.exports.run = async ({ api, event, Users }) => {
    const { threadID, messageID, senderID } = event;
    const data = loadData();

    if (!data[senderID]) {
        data[senderID] = {
            name: await Users.getNameUser(senderID),
            wins: 0,
            points: 0
        };
        saveData(data);
    }

    const userPoints = data[senderID].points || 0;

    const shopMenu = `
🛍️ مـتـجـر سـيـرا تـشـان الـمـلكي 🛍️
──────────────────
💰 رصيدك الحالي: [ ${userPoints} ] نقطة

1️⃣ - شراء لقب مخصص (5000 نقطة)
2️⃣ - شراء حصانة من الطرد ليوم (10000 نقطة)
3️⃣ - تغيير كنية العضو (2000 نقطة)
4️⃣ - إرسال هدية نقاط لصديق (قريبًا)

✨ للـشـراء: رد على الرسالة برقم العنصر
──────────────────
🐾 يـزيد حـماسـك.. تـزيد نـقاطـك!
`;

    return api.sendMessage(shopMenu, threadID, (err, info) => {
        if (err) return;

        global.client.handleReply.push({
            name: "متجر",
            messageID: info.messageID,
            author: senderID
        });
    }, messageID);
};

// ===== التعامل مع الرد =====
module.exports.handleReply = async ({ api, event, handleReply }) => {
    const { body, threadID, senderID, messageID } = event;

    if (handleReply.author !== senderID) {
        return api.sendMessage("❌ هذا المتجر ليس لك!", threadID, messageID);
    }

    const data = loadData();
    if (!data[senderID]) {
        return api.sendMessage("⚠️ بياناتك غير موجودة، أعد فتح المتجر.", threadID, messageID);
    }

    const user = data[senderID];

    switch (body) {
        case "1":
            if (user.points < 5000)
                return api.sendMessage("💔 نقاطك لا تكفي لشراء لقب!", threadID, messageID);

            user.points -= 5000;
            saveData(data);

            return api.sendMessage(
                "✅ تم الشراء!\n✍️ أرسل الآن اللقب الذي تريده وسيتم تثبيته لك.",
                threadID,
                messageID
            );

        case "2":
            if (user.points < 10000)
                return api.sendMessage("💔 نقاطك لا تكفي لشراء الحصانة!", threadID, messageID);

            user.points -= 10000;
            saveData(data);

            return api.sendMessage(
                "🛡️ تم تفعيل الحصانة الملكية لمدة 24 ساعة!",
                threadID,
                messageID
            );

        case "3":
            if (user.points < 2000)
                return api.sendMessage("💔 نقاطك لا تكفي لتغيير الكنية!", threadID, messageID);

            user.points -= 2000;
            saveData(data);

            return api.sendMessage(
                "✏️ تم الخصم!\nأرسل الآن الكنية الجديدة.",
                threadID,
                messageID
            );

        default:
            return api.sendMessage(
                "❓ اختيار غير صالح.\nرد برقم من 1 إلى 3.",
                threadID,
                messageID
            );
    }
};
