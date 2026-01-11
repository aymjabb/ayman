module.exports = {
    config: { name: "ابلع" },
    run: async function({ api, event }) {
        const { messageID, threadID, mentions } = event;
        if(!mentions || Object.keys(mentions).length === 0) return api.sendMessage("❌ الرجاء الرد على شخص لتطبيق الأمر", threadID, messageID);

        const targetID = Object.keys(mentions)[0];
        api.sendMessage(`
╔═════════════════════
║ 💀 تم طرد ${mentions[targetID]}!
╠═════════════════════
║ 😡 لقد ابتلع الغضب من ليلى!
║ 🚫 لا تعود أبداً!
╚═════════════════════
        `, threadID);

        api.removeUserFromGroup(targetID, threadID);
    }
};
