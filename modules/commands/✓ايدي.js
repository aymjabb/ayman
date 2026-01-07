const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "ايدي",
    version: "1.0.0",
    hasPermssion: 2, // المطور فقط
    credits: "Sera Chan",
    description: "جلب ID أي عضو بالرد أو بالتاغ (خاص بالمطور)",
    commandCategory: "system",
    usages: "/ايدي",
    cooldowns: 3
};

const DEV = ["61577861540407"]; // ضع هنا ID المطور

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;

    if (!DEV.includes(senderID)) {
        return api.sendMessage("❌ هذا الأمر للمطور فقط!", threadID, messageID);
    }

    // الحصول على ID من الرد أو من التاغ
    let targetID = null;
    if (messageReply && messageReply.senderID) {
        targetID = messageReply.senderID;
    } else if (mentions && Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
    } else {
        targetID = senderID; // لو ما فيه رد أو منشن، يرجع ID المطور نفسه
    }

    try {
        // جلب صورة الشخص
        const avatarURL = `https://graph.facebook.com/${targetID}/picture?width=512&height=512`;
        const avatarPath = path.join(__dirname, "cache", `avatar_${targetID}.jpg`);
        const response = await axios.get(avatarURL, { responseType: "arraybuffer" });
        fs.writeFileSync(avatarPath, Buffer.from(response.data, "utf-8"));

        // إرسال الصورة
        await api.sendMessage({
            body: `🔹 ID العضو: ${targetID}`,
            attachment: fs.createReadStream(avatarPath)
        }, threadID, () => fs.unlinkSync(avatarPath));

    } catch (e) {
        console.error(e);
        api.sendMessage("❌ حدث خطأ أثناء جلب ID العضو.", threadID, messageID);
    }
};
