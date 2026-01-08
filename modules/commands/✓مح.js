module.exports.config = {
  name: "طرد",
  version: "2.0.0",
  hasPermssion: 1, // 1 للمشرفين، 2 للمطورين
  credits: "Sera Bot",
  description: "طرد العضو عن طريق المنشن أو الرد",
  commandCategory: "الادارة",
  usages: "[بالرد على رسالته] أو [@منشن]",
  cooldowns: 2
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID, mentions, type, messageReply } = event;

  try {
    let targetID;

    // 1. التحقق إذا كان هناك رد على رسالة (Reply)
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } 
    // 2. التحقق إذا كان هناك منشن (Mention)
    else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } 
    // 3. إذا لم يتوفر أي منهما
    else {
      return api.sendMessage("⚠️ يرجى الرد على رسالة الشخص أو عمل منشن له لطرده.", threadID, messageID);
    }

    // منع البوت من محاولة طرد نفسه
    if (targetID == api.getCurrentUserID()) {
      return api.sendMessage("❌ لا يمكنني طرد نفسي!", threadID, messageID);
    }

    // تنفيذ أمر الطرد
    api.removeUserFromGroup(targetID, threadID, (err) => {
      if (err) {
        return api.sendMessage("❌ فشل الطرد. تأكد من أنني مشرف (Admin) في المجموعة.", threadID, messageID);
      } else {
        return api.sendMessage("🚪 تم طرد العضو بنجاح من المجموعة.", threadID);
      }
    });

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ حدث خطأ غير متوقع أثناء تنفيذ الأمر.", threadID, messageID);
  }
};
