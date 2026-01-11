module.exports = function({ api, event, Threads, Users }) {
    const DEV_ID = "61577861540407";
    const { senderID, threadID, messageID } = event;
    if(senderID !== DEV_ID) return api.sendMessage("❌", threadID, messageID);

    (async () => {
        let allThreads = await Threads.getAll();
        let totalThreads = allThreads.length;
        let totalMembers = 0;
        for(let th of allThreads) totalMembers += th.participantIDs.length;

        let memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        let cpu = process.cpuUsage();

        let msg = `
╔═══════════════
║ 🌸  ليلى - حالة البوت 🌸
╠═══════════════
║ عدد الكروبات: ${totalThreads}
║ مجموع الأعضاء: ${totalMembers}
║ استهلاك الذاكرة: ${memoryUsage} MB
║ CPU: User ${cpu.user}, System ${cpu.system}
╚═══════════════
        `;
        api.sendMessage(msg, threadID, messageID);
    })();
};
