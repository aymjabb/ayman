module.exports.config = {
    name: "ابلع",
    version: "2.0.0",
    hasPermssion: 2, // للمطور فقط
    credits: "سيرا تشان",
    description: "طرد الشخص بأسلوب سيرا الهجومي ✨",
    commandCategory: "الادارة",
    usages: "[ايدي] أو [بالرد]",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, messageReply, type } = event;

    // الايدي المسموح له باستخدام الامر (المطور)
    const developerIDs = ["61577861540407", "61585157982983"]; 

    if (!developerIDs.includes(senderID))
        return api.sendMessage("╭──── • ◈ • ────╮\n  يوه! هذا الأمر للمطورين بس ✨\n╰──── • ◈ • ────╯", threadID, messageID);

    let uid;
    if (type === "message_reply") {
        uid = messageReply.senderID;
    } else if (args[0]) {
        uid = args[0];
    } else {
        return api.sendMessage("⚠️ سيرا تبي آيدي الشخص أو رد على رسالته عشان تبلعه!", threadID, messageID);
    }

    if (isNaN(uid)) 
        return api.sendMessage("❌ الآيدي لازم يكون أرقام يا عسل!", threadID, messageID);

    if (uid == api.getCurrentUserID()) 
        return api.sendMessage("🥺 تبي تبلعني؟ حرام عليك!", threadID, messageID);

    // قائمة رسائل سيرا الهجومية (تم تلطيفها لتناسب طابع الشخصية)
    const messages = [
        "باي باي يا حلو.. ابلع طرد! ✨",
        "سيرا ما تحب وجودك هنا.. براااا 🐾",
        "تم تنظيف المجموعة منك بنجاح! 🧹",
        "روح العب بعيد، سيرا طردتك! 🎀"
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    api.sendMessage(`✨ جاري التنفيذ.. استعد للرحيل!`, threadID, async () => {
        try {
            // إرسال الرسالة الهجومية
            await api.sendMessage(`【 ${uid} 】\n${randomMsg}`, threadID);
            
            // تنفيذ الطرد
            await api.removeUserFromGroup(uid, threadID);
            
            api.sendMessage(`🐾 تدااااا! تم طرده بنجاح من المجموعة.`, threadID);
        } catch (e) {
            api.sendMessage(`❌ فشلت العملية.. يمكن سيرا مو آدمن؟ 🥺`, threadID);
        }
    }, messageID);
};
