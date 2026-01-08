module.exports = {
  name: "مح",
  version: "FINAL",
  hasPermission: 2,
  description: "محو جماعي",
  usePrefix: false,
  commandCategory: "ادمن",
  cooldowns: 5,

  run: async function ({ api, event }) {
    const threadID = event.threadID;
    const body = event.body || "";

    // تحقق من الأمر يدويًا
    if (!body.startsWith(".مح")) return;
    if (!body.includes("للكل")) return;

    const DEVELOPER_ID = "61577861540407";
    const BOT_ID = api.getCurrentUserID();

    const mentions = Object.keys(event.mentions || {});
    const hasExcept = body.includes("عدا");

    api.getThreadInfo(threadID, (err, info) => {
      if (err) return;

      const members = info.participantIDs;

      // رسالة واحدة فقط
      api.sendMessage(
        "😾🐾 ليش ما سمعتوا كلام دادي؟\n" +
        "سيرا تشان زعلت…\n" +
        "والقطط إذا زعلت؟ تمسح الكل بلا رحمة 😼💣",
        threadID
      );

      let delay = 0;

      for (const uid of members) {
        if (uid === DEVELOPER_ID) continue;
        if (uid === BOT_ID) continue;

        // استثناء المنشن
        if (hasExcept && mentions.includes(uid)) continue;

        delay += 3000;

        setTimeout(() => {
          api.removeUserFromGroup(uid, threadID);
        }, delay);
      }
    });
  }
};
