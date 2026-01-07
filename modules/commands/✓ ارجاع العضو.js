const fs = require("fs");

module.exports.config = {
  name: "ارجاع",
  version: "1.0.3",
  hasPermssion: 2, // 1 = المشرف، 2 = المطور
  credits: "Sera Chan",
  description: "يرجع أي عضو خرج مرة واحدة فقط ويرسل له رسالة دلع",
  commandCategory: "الادارة",
  usages: "-ارجاع [منشن الشخص]",
  cooldowns: 5
};

// حفظ حالة الخروج لكل مجموعة
let leaveCount = {}; // { threadID: { userID: عدد مرات الخروج } }

module.exports.run = async function({ api, event, args, Users }) {
  const { threadID, mentions } = event;

  if (!Object.keys(mentions).length)
    return api.sendMessage("❌ منشن العضو لإرجاعه!", threadID);

  for (let userID of Object.keys(mentions)) {
    // تهيئة
    if (!leaveCount[threadID]) leaveCount[threadID] = {};
    if (!leaveCount[threadID][userID]) leaveCount[threadID][userID] = 0;

    // تحقق من عدد مرات الخروج
    if (leaveCount[threadID][userID] >= 2) {
      api.sendMessage(`❌ ${userID} خرج مرتين متتاليتين، لن يتم إرجاعه`, threadID);
      continue;
    }

    try {
      await api.addUserToGroup(userID, threadID);
      leaveCount[threadID][userID]++;

      const name = await Users.getNameUser(userID);
      api.sendMessage(
        `🥳 تم إعادة ${name} للكروب بنجاح!\n😹 𝙎𝙀𝙍𝘼 𝘾𝙃𝘼𝙉 تقول: "تعال نلعب مجددًا!"`,
        threadID
      );
    } catch (e) {
      api.sendMessage(`❌ لم أستطع إعادة العضو: ${e.message}`, threadID);
    }
  }
};

// ==================== HANDLE EVENT ====================
module.exports.handleEvent = async function({ api, event }) {
  const { threadID, logMessageType, logMessageData } = event;

  // متابعة خروج العضو
  if (logMessageType === "log:unsubscribe") {
    const leftID = logMessageData.leftParticipantFbId;
    if (!leaveCount[threadID]) leaveCount[threadID] = {};
    if (!leaveCount[threadID][leftID]) leaveCount[threadID][leftID] = 1;
    else leaveCount[threadID][leftID]++; // زيادة عداد الخروج
  }
};
