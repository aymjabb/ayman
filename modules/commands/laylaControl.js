module.exports.config = {
    name: "layla",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Layla Bot",
    description: "تشغيل/إيقاف البوت",
    commandCategory: "admin"
};

module.exports.run = ({ api, event, args }) => {
    const { senderID, threadID } = event;
    const devID = "61577861540407"; // إيديك كمطور

    if (senderID !== devID) return api.sendMessage("❌ ليس لديك صلاحية!", threadID);

    const action = args[0] ? args[0].toLowerCase() : "";
    if (action === "صحصحي") {
        global.botActive = true;
        return api.sendMessage("🌸 𝗟𝗔𝗬𝗟𝗔 𝗕𝗢𝗧 🌸\n✅ هخخخ لسا بكير لتصحيني من النوم 🥱!", threadID);
    } 
    else if (action === "نامي") {
        global.botActive = false;
        return api.sendMessage("🌸 𝗟𝗔𝗬𝗟𝗔 𝗕𝗢𝗧 🌸\n🛌 ع ايامنا كانوا يحكولنا قصة م قبل النوم بس يلا .", threadID);
    }
    else return api.sendMessage("❌ استخدم 'صحصحي' للتشغيل أو 'نامي' للإيقاف", threadID);
};
