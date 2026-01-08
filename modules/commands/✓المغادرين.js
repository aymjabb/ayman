const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "المغادرين",
    version: "1.4.0",
    hasPermssion: 1,
    credits: "Ayman",
    description: "قائمة المغادرين مرتبة",
    commandCategory: "ادمن",
    cooldowns: 5
};

const pathData = path.join(__dirname, "cache", "left_members.json");

module.exports.run = async function({ api, event, args }) {
    if (!fs.existsSync(pathData)) return api.sendMessage("❌ القائمة فارغة.", event.threadID);
    const data = JSON.parse(fs.readFileSync(pathData, "utf-8"));
    const list = data[event.threadID] || [];

    if (list.length == 0) return api.sendMessage("📋 لا يوجد مغادرين مسجلين.", event.threadID);

    let msg = "📋 سـجـل الـمـغـادرين:\n──────────────────\n";
    list.forEach((u, i) => msg += `${i + 1}. ${u.name} (ID: ${u.id})\n`);
    
    return api.sendMessage(msg, event.threadID);
};
