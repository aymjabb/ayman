module.exports.config = {
  name: "مح",
  version: "1.1.1",
  hasPermssion: 1, // للأدمن والمطور
  credits: "Ayman & Sera",
  description: "طرد (مح) عضو من المجموعة",
  commandCategory: "إدارة",
  usages: "[منشن / رد / ايدي]",
  cooldowns: 2
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, mentions, type, messageReply } = event;

  try {
    // جلب معلومات المجموعة
    const threadInfo = await api.getThreadInfo(threadID);

    // التأكد أن البوت أدمن
    const botID = api.getCurrentUserID();
    if (!threadInfo.adminIDs.some(a => a.id == botID)) {
      return api.sendMessage(
        "❌ سيرا تشان تحتاج لرتبة (أدمن) لتنفيذ أمر (مح).",
        threadID,
        messageID
      );
    }

    // تحديد الشخص المستهدف
    let targetID;
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args[0] && !isNaN(args[0])) {
      targetID = args[0];
    }

    if (!targetID) {
      return api.sendMessage(
        "👤 منشن الشخص، أو رد على رسالته، أو اكتب الايدي لتنفيذ (مح).",
        threadID,
        messageID
      );
    }

    // منع طرد البوت نفسه
    if (targetID == botID) {
      return api.sendMessage(
        "🤖 لا أستطيع تنفيذ (مح) على نفسي 😅",
        threadID,
        messageID
      );
    }

    // منع طرد أدمن أعلى
    if (threadInfo.adminIDs.some(a => a.id == targetID)) {
      return api.sendMessage(
        "⚠️ لا يمكن تقبيل الادمن أدمن.",
        threadID,
        messageID
      );
    }

    // تنفيذ الطرد
    return api.removeUserFromGroup(targetID, threadID, (err) => {
      if (err) {
        console.error("خطأ الطرد:", err);
        return api.sendMessage(
          "❌ فشلت العملية، قد تكون الصلاحيات غير كافية.",
          threadID,
          messageID
        );
      }

      api.sendMessage(
        "🚀 تم تنفيذ الـ (مح) بنجاح.. طار المزعج! 😎",
        threadID
      );
    });

  } catch (err) {
    console.error("خطأ عام:", err);
    return api.sendMessage(
      "❌ حدث خطأ غير متوقع أثناء تنفيذ الأمر.",
      threadID,
      messageID
    );
  }
};
