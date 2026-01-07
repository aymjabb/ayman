module.exports.config = {
  name: "تثبيت",
  version: "1.0.0",
  hasPermssion: 1, // أدمن فقط
  credits: "Sera Chan",
  description: "تثبيت رسالة في الكروب",
  commandCategory: "الإدارة",
  usages: ".تثبيت (بالرد على رسالة)",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, messageReply, senderID } = event;

  // لازم يكون في رد
  if (!messageReply)
    return api.sendMessage(
      "📌 لازم ترد على الرسالة اللي بدك تثبتها",
      threadID,
      messageID
    );

  try {
    await api.pinMessage(messageReply.messageID, threadID);
    return api.sendMessage(
      "✅ تم تثبيت الرسالة بنجاح 📌",
      threadID,
      messageID
    );
  } catch (err) {
    return api.sendMessage(
      "❌ ما قدرت أثبّت الرسالة\n⚠️ تأكد أن البوت أدمن",
      threadID,
      messageID
    );
  }
};
