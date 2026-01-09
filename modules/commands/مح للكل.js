module.exports = {
  name: "مح",
  version: "1.5.0",
  hasPermission: 2,
  description: "تصفية المجموعة بطريقة سيرا تشان",
  commandCategory: "ادمن",
  cooldowns: 10,
  run: async function ({ api, event, args }) {
    const { threadID, senderID, mentions } = event;
    const AYMAN_ID = "61577861540407";
    const BOT_ID = api.getCurrentUserID();
    const exclusions = Object.keys(mentions || {});

    api.getThreadInfo(threadID, async (err, info) => {
      if (err) return;
      api.sendMessage("⚠️ سيرا تشان بدأت عملية التطهير..\n──────────────────\nالقطط لا ترحم من يعبث بنظام الزعيم أيمن! 😼💣", threadID);

      for (const uid of info.participantIDs) {
        if (uid === AYMAN_ID || uid === BOT_ID || exclusions.includes(uid)) continue;
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        api.removeUserFromGroup(uid, threadID).catch(() => {});
      }
    });
  }
};
