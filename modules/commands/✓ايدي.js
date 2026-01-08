const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "ايدي",
    version: "2.1.0",
    hasPermssion: 0, // جعلته للكل لتعم الفائدة، أو غيره لـ 2 للمطور
    credits: "سيرا تشان",
    description: "جلب أيدي الشخص وصورته بشكل مباشر ✨",
    commandCategory: "الادارة",
    usages: "[بالرد] أو [@منشن]",
    cooldowns: 2
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, mentions, messageReply, senderID } = event;

    // تحديد الأيدي المستهدف (رد، منشن، أو الشخص نفسه)
    let targetID;
    if (messageReply) {
        targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
    } else {
        targetID = senderID;
    }

    const cachePath = path.join(__dirname, "cache", `${targetID}.png`);

    try {
        // رابط الصورة المباشر (يعمل بشكل أفضل حالياً)
        const avatarURL = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        
        const response = await axios.get(avatarURL, { responseType: "arraybuffer" });
        fs.outputFileSync(cachePath, Buffer.from(response.data, "utf-8"));

        // إرسال الأيدي فقط مع الصورة كملحق
        return api.sendMessage({
            body: `${targetID}`, 
            attachment: fs.createReadStream(cachePath)
        }, threadID, () => {
            if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        }, messageID);

    } catch (e) {
        // في حال فشل جلب الصورة، نرسل الأيدي نصاً فقط
        console.error(e);
        return api.sendMessage(`${targetID}`, threadID, messageID);
    }
};
