const fs = require("fs");

module.exports.config = {
  name: "حماية",
  version: "2.2.0",
  hasPermssion: 1,
  credits: "D-Jukie & عمر & سيرا تشان",
  description: "حماية الكروب من التعديلات غير المصرح بها",
  usages: ".حماية [فئة/كل]",
  commandCategory: "المطور",
  cooldowns: 0
};

const DEV = ["61577861540407"];
const PROTECT_TYPES = ["image", "name", "nickname", "wallpaper", "admin", "emoji"];

// تفعيل الحماية
module.exports.run = async ({ api, event, args, Threads }) => {
  const { threadID, messageID, senderID } = event;
  const botID = api.getCurrentUserID();
  const threadInfo = await api.getThreadInfo(threadID);

  if (!threadInfo.adminIDs.some(a => a.id == senderID) && !DEV.includes(senderID))
    return api.sendMessage("❌ أنت ما عندك صلاحية لتشغيل الحماية! 🐱‍👤", threadID, messageID);

  if (!threadInfo.adminIDs.some(a => a.id == botID))
    return api.sendMessage("❌ البوت بحاجة أن يكون أدمن لتفعيل الحماية ⚡", threadID, messageID);

  if (!global.data.threadData) global.data.threadData = new Map();
  const threadData = (await Threads.getData(threadID)).data || {};
  if (!threadData.guard) threadData.guard = {};

  const target = args[0] ? args[0].toLowerCase() : null;

  if (!target)
    return api.sendMessage(`⚡ استخدم: .حماية [فئة/كل]\n💠 الفئات: ${PROTECT_TYPES.join(", ")}\n💠 كل → لتفعيل جميع الفئات`, threadID, messageID);

  if (target === "كل") {
    PROTECT_TYPES.forEach(type => threadData.guard[type] = true);
  } else if (!PROTECT_TYPES.includes(target)) {
    return api.sendMessage(`❌ الفئة غير موجودة! استخدم: ${PROTECT_TYPES.join(", ")}, كل`, threadID, messageID);
  } else {
    threadData.guard[target] = true;
  }

  await Threads.setData(threadID, { data: threadData });
  global.data.threadData.set(parseInt(threadID), threadData);

  return api.sendMessage(`✅ تم تفعيل حماية فئة: ${target || "كل"} ⚡`, threadID, messageID);
};

// مراقبة الأحداث
module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, senderID, logMessageType } = event;
  const botID = api.getCurrentUserID();
  if (!global.data.threadData) return;
  const threadData = global.data.threadData.get(threadID);
  if (!threadData || !threadData.guard) return;
  if (senderID == botID || DEV.includes(senderID)) return;

  const info = await api.getThreadInfo(threadID);
  const safeIDs = info.adminIDs.map(a => a.id).concat(DEV);

  if (!safeIDs.includes(senderID)) {
    const typeMap = {
      "log:thread-name": "name",
      "log:thread-icon": "image",
      "log:thread-admins": "admin",
      "log:thread-nickname": "nickname",
      "log:thread-wallpaper": "wallpaper",
      "log:thread-emoji": "emoji"
    };

    const guardType = typeMap[logMessageType];
    if (guardType && threadData.guard[guardType]) {
      try {
        await api.removeUserFromGroup(senderID, threadID);
        await api.sendMessage(`😂 حاولت تعدّل شيء محمي في الكروب! سيرا تشان طلعت لك البطاقة وطردتك 🐾`, threadID);
      } catch (e) {
        console.error(e);
      }
    }
  }
};
