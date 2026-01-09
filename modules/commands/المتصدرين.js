const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "ترتيب",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Ayman",
    description: "عرض قائمة متصدري المسابقات",
    commandCategory: "ترفيه",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const { threadID, messageID } = event;

    const cacheDir = path.join(__dirname, "cache");
    const scoresPath = path.join(cacheDir, "topPlayer.json");

    try {
        // التأكد من وجود المجلد
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // التأكد من وجود الملف
        if (!fs.existsSync(scoresPath)) {
            return api.sendMessage(
                "📩 لا يوجد بيانات مسابقات بعد.",
                threadID,
                messageID
            );
        }

        const scores = fs.readJsonSync(scoresPath);

        if (Object.keys(scores).length === 0) {
            return api.sendMessage(
                "📭 لا يوجد أي متسابقين مسجلين حاليًا.",
                threadID,
                messageID
            );
        }

        let sortArray = [];

        for (const id in scores) {
            sortArray.push({
                id,
                name: scores[id].name || "مستخدم مجهول",
                wins: Number(scores[id].wins) || 0
            });
        }

        // ترتيب من الأعلى فوزًا إلى الأقل
        sortArray.sort((a, b) => b.wins - a.wins);

        let msg = "🏆 لـوحـة شـرف الأذكـيـاء 🏆\n──────────────────\n";

        const top = sortArray.slice(0, 10);

        top.forEach((user, index) => {
            let rank;
            switch (index) {
                case 0:
                    rank = "🥇 الملك:";
                    break;
                case 1:
                    rank = "🥈 الوزير:";
                    break;
                case 2:
                    rank = "🥉 الفارس:";
                    break;
                default:
                    rank = `${index + 1} -`;
            }

            msg += `${rank} ${user.name}\n🔥 فوزات: [ ${user.wins} ]\n\n`;
        });

        msg += "──────────────────\n🐾 سيرا تشان فخورة بكم!";

        return api.sendMessage(msg, threadID, messageID);

    } catch (err) {
        console.error("خطأ أمر ترتيب:", err);
        return api.sendMessage(
            "❌ حدث خطأ أثناء تحميل الترتيب.",
            threadID,
            messageID
        );
    }
};
