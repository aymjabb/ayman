module.exports.config = {
  name: "الدرع",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Ayman",
  description: "حماية معلومات المجموعة",
  commandCategory: "حماية",
  cooldowns: 0
};

if (!global.sera_guard) global.sera_guard = {};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, logMessageType, author, logMessageData } = event;
  const MY_ID = "61577861540407"; // ايديك يا بطل

  if (!global.sera_guard[threadID]) return;
  if (author == MY_ID || author == api.getCurrentUserID()) return;

  // حماية الاسم
  if (logMessageType == "log:thread-name") {
    api.setTitle(logMessageData.oldName, threadID);
    api.sendMessage("🚫 ممنوع تغيير الاسم!", threadID);
  }
  // حماية الكنيات
  if (logMessageType == "log:user-nickname") {
    api.setUserNickname(logMessageData.oldNickname, threadID, logMessageData.participantID);
    api.sendMessage("🚫 الكنيات مقفولة بأمر أيمن!", threadID);
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID } = event;
  if (args[0] == "تشغيل") {
    global.sera_guard[threadID] = true;
    return api.sendMessage("🛡️ تم تفعيل الدرع الكارثي!", threadID);
  }
  if (args[0] == "ايقاف") {
    global.sera_guard[threadID] = false;
    return api.sendMessage("🔓 تم إيقاف الدرع.", threadID);
  }
  return api.sendMessage("استخدم: الدرع تشغيل / ايقاف", threadID);
};
