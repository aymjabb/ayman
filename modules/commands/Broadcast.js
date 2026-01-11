module.exports = {
    config: { name: "اخطار" },
    run: async function({ api, Threads, event, args }) {
        const { messageID, threadID } = event;
        const text = args.join(" ") || "⚠️ تحذير من ليلى!";

        for (const tID of Threads.allThreadID) {
            api.sendMessage(`
╔═════════════════════
║ 🛡️ رسالة تحذير من ليلى 🛡️
╠═════════════════════
║ ${text}
╚═════════════════════
            `, tID);
        }

        api.sendMessage("✅ تم إرسال التحذير لجميع الكروبات.", threadID, messageID);
    }
};
