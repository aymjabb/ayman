module.exports = {
    config: { name: "حظر" },
    run: async function({ api, event, globalData }) {
        const { threadID, messageID, mentions } = event;
        if(!mentions || Object.keys(mentions).length === 0) return api.sendMessage("❌ الرجاء الرد على شخص للحظر", threadID, messageID);

        const targetID = Object.keys(mentions)[0];
        globalData.bannedUsers.add(targetID);

        api.sendMessage("🚫 تم حظر هذا الشخص ولن يتم الرد عليه مجدداً.", threadID, messageID);
    }
};
