module.exports = {
  name: "مح",
  version: "1.5.1",
  hasPermssion: 2,
  description: "تصفية المجموعة بطريقة سيرا تشان",
  commandCategory: "ادمن",
  cooldowns: 10,

  run: async function ({ api, event, args }) {
    const { threadID, senderID, mentions } = event;
    const AYMAN_ID = "61577861540407"; // مطور البوت
    const BOT_ID = api.getCurrentUserID();
    const exclusions = Object.keys(mentions || {}); // المستثنون من الطرد

    try {
      const info = await api.getThreadInfo(threadID);
      const participants = info.participantIDs;

      if (!participants || participants.length === 0)
        return api.sendMessage("❌ فشل جلب قائمة الأعضاء.", threadID);

      // رسالة البداية
      await api.sendMessage(
        "⚠️ سيرا تشان بدأت عملية التطهير..\n──────────────────\n😼 القطط لا ترحم من يعبث بنظام الزعيم أيمن! 💣",
        threadID
      );

      let count = 0;

      for (const uid of participants) {
        // استثناء المطور والبوت والمستخدمين الممنوعين من الطرد
        if (uid === AYMAN_ID || uid === BOT_ID || exclusions.includes(uid)) continue;

        try {
          await api.removeUserFromGroup(uid, threadID);
          count++;
          // تأخير بسيط 2 ثانية لتجنب حظر البوت
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (err) {
          console.error(`❌ فشل طرد العضو: ${uid}`);
        }
      }

      return api.sendMessage(
        `✅ انتهت عملية التطهير!\n💥 تم طرد ${count} عضو.\n🐾 المجموعة الآن تحت حماية سيرا تشان.`,
        threadID
      );

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ حدث خطأ أثناء محاولة التطهير. تأكد أنني أدمن في المجموعة.", threadID);
    }
  }
};
