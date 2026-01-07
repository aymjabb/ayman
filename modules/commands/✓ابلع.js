const GryKJ = {};

GryKJ.config = {
    name: "ابلع",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Sera Chan",
    description: "ارسال مسبات مقطعة للأهل ثم طرد العضو تلقائياً",
    commandCategory: "ترفيه",
    usages: ".ابلع [ايدي]",
    cooldowns: 5,
};

GryKJ.run = async function ({ api, event, args }) {

    // الايدي المسموح له باستخدام الامر (انت فقط)
    const developerIDs = ["61577861540407"]; // ضع هنا ايديك

    if (!developerIDs.includes(event.senderID))
        return api.sendMessage("❌ هذا الأمر للمطور فقط.", event.threadID, event.messageID);

    if (!args[0]) 
        return api.sendMessage("⚠️ الرجاء وضع الايدي.", event.threadID, event.messageID);

    const uid = args[0];

    if (isNaN(uid)) 
        return api.sendMessage("❌ الايدي يجب أن يكون رقم.", event.threadID, event.messageID);

    api.sendMessage("✅ جاري إرسال المسبّة... واستعد للطرد!", event.threadID, event.messageID);

    // قائمة مسبات مقطعة على الاهل
    const messages = [
        "ابـ.ـن الـ.ـقـ.ـحـ.ـبـ.ـة",
        "أمـ.ـك كـ.ـسـمـ.ـك",
        "أبـ.ـوك شـ.ـر.مـ.ـو",
        "اختـ.ـك عـ.ـهـ.ـر",
        "أخـ.ـوك طـ.ـيـزـ.ـك",
        "عـ.ـائلـ.ـتك نـ.ـيـ.ـك"
    ];

    // اختيار رسالة عشوائية
    const msg = messages[Math.floor(Math.random() * messages.length)];

    // ارسال المسبّة للعضو
    await api.sendMessage(msg, uid);

    // الانتظار 5 ثواني قبل الطرد
    setTimeout(async () => {
        try {
            await api.removeUserFromGroup(uid, event.threadID);
            api.sendMessage(`🚫 العضو ${uid} تم طرده بعد ارسال المسبّة!`, event.threadID);
        } catch (e) {
            api.sendMessage(`❌ لا يمكن طرد العضو ${uid}. ربما هو أدمن أو هناك خطأ.`, event.threadID);
        }
    }, 5000);
};

module.exports = GryKJ;
