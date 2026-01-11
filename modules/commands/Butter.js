module.exports = {
    config: { name: "زبدة" },
    run: async function({ api, event, args, globalData }) {
        const { threadID, messageID } = event;
        const action = args[0];
        if(action === "اون") {
            globalData.protectDev[threadID] = true;
            api.sendMessage(`
╔═════════════════════
║ 🛡️ حماية المطور والبوت مفعلة
╠═════════════════════
║ أي محاولة لطردنا سيتم التراجع عنها فوراً!
╚═════════════════════
            `, threadID, messageID);
        } else if(action === "اوف") {
            globalData.protectDev[threadID] = false;
            api.sendMessage("❌ تم إيقاف حماية المطور والبوت.", threadID, messageID);
        }
    }
};
