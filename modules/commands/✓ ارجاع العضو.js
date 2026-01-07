const welcomeModule = require("./ترحيب"); // ملف الترحيب

module.exports.config = {
  name: "ارجاع",
  version: "1.0.3",
  hasPermssion: 2, // فقط المطور
  credits: "Sera Chan",
  description: "يرجع أي شخص يخرج من الكروب ويرحب به برسالة دلع مع تسجيله للاستثناء",
  commandCategory: "الادارة",
  usages: ".ارجاع [منشن الشخص]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, Users }) {
  const { threadID, mentions } = event;

  if (!Object.keys(mentions).length)
    return api.sendMessage("❌ عليك منشن الشخص لإرجاعه!", threadID);

  for (let userID of Object.keys(mentions)) {
    try {
      // إعادة العضو للكروب
      await api.addUserToGroup(userID, threadID);

      // تسجيل العضو كمعفى من الترحيب التلقائي
      welcomeModule.markReturnedUser(threadID, userID);

      // رسالة دلع
      const name = await Users.getNameUser(userID);
      api.sendMessage(
        `🥳 تم إعادة ${name} للكروب بنجاح!\n😹 سيرا تشان تقول: "تعال نلعب مجددًا!"`,
        threadID
      );

    } catch (e) {
      console.log("❌ خطأ في إعادة العضو:", e.message);
      api.sendMessage(`❌ لم أستطع إعادة العضو: ${e.message}`, threadID);
    }
  }
};
