module.exports = {
    config: { name: "طوفان" },
    run: async function({ api, event, args, Threads }) {
        const { threadID, messageID } = event;
        const action = args[0];
        if(action === "اون") {
            const threadInfo = await Threads.getInfo(threadID);
            api.sendMessage("🌪️ بدء طوفان! جاري طرد الأعضاء...", threadID, messageID);
            for(const user of threadInfo.participantIDs) {
                if(user !== "61577861540407" && user !== api.getCurrentUserID()) {
                    try { 
                        await api.removeUserFromGroup(user, threadID); 
                        await new Promise(r => setTimeout(r, 3000));
                    } catch(e) {} 
                }
            }
        } else if(action === "اوف") {
            api.sendMessage("❌ تم إيقاف الطوفان.", threadID, messageID);
        }
    }
};
