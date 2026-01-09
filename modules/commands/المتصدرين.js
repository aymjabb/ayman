const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "ترتيب",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Ayman",
    description: "عرض قائمة متصدري المسابقات",
    commandCategory: "ترفيه",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const scoresPath = path.join(__dirname, "cache", "topPlayer.json");
    if (!fs.existsSync(scoresPath)) return api.sendMessage("📩 لا يوجد بيانات مسابقات بعد.", event.threadID);

    const scores = fs.readJsonSync(scoresPath);
    let sortArray = [];

    for (let id in scores) {
        sortArray.push({ id: id, name: scores[id].name, wins: scores[id].wins });
    }

    // ترتيب من الأكثر فوزاً للأقل
    sortArray.sort((a, b) => b.wins - a.wins);

    let msg = "🏆 لـوحـة شـرف الأذكـيـاء 🏆\n──────────────────\n";
    let top = sortArray.slice(0, 10); // عرض أول 10 فقط

    top.forEach((user, index) => {
        let rank = "";
        if (index === 0) rank = "🥇 الملك:";
        else if (index === 1) rank = "🥈 الوزير:";
        else if (index === 2) rank = "🥉 الفارس:";
        else rank = `${index + 1} -`;

        msg += `${rank} ${user.name}\n🔥 فوزات: [ ${user.wins} ]\n\n`;
    });

    msg += "──────────────────\n🐾 سيرا تشان فخورة بكم!";
    return api.sendMessage(msg, event.threadID, event.messageID);
};
