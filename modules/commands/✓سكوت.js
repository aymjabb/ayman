module.exports.config = {
  name: "سكوت",
  version: "1.2.0",
  hasPermssion: 2,
  credits: "DRIDI-RAYEN",
  description: "تقوم ايفا بطرد كل من يتكلم في وضع السكوت",
  usePrefix: false,
  commandCategory: "〘 ادمن المجموعات 〙",
  usages: "سكوت تشغيل/ايقاف",
  cooldowns: 5,

  allowedThreads: [],
  isOn: false,
  developerID: ["61577861540407"] // أيديك كمطور رئيسي
};

module.exports.handleEvent = async ({ api, event }) => {
  if (!module.exports.config.isOn) return;

  let user = await api.getUserInfo(event.senderID);
  let thread = await api.getThreadInfo(event.threadID);
  let name = user[event.senderID].name;

  // تجاهل المطور أو نفسك
  if (event.senderID == api.getCurrentUserID() || module.exports.config.developerID.includes(event.senderID)) return;

  // تحقق إذا الموضوع ضمن الخيوط المفعلة
  if (!module.exports.config.allowedThreads.includes(event.threadID)) return;

  if (event.type === "message" && !(thread.adminIDs.some(u => u.id == event.senderID))) {
    // طرد المستخدم
    api.removeUserFromGroup(event.senderID, event.threadID);

    return api.sendMessage(
      {
        body: `💥😾 بابا أيمن يقول اسكتوا يا ${name}!! 💢😡\n\n🚫 لا تتحرك أو تتكلم وإلا الطرد آتٍ! 🔥😎`,
        mentions: [
          {
            tag: name,
            id: event.senderID
          }
        ]
      },
      event.threadID
    );
  }
};

module.exports.run = async function ({ api, args, event }) {
  if (args[0] === "تشغيل") {
    module.exports.config.isOn = true;
    if (!module.exports.config.allowedThreads.includes(event.threadID)) {
      module.exports.config.allowedThreads.push(event.threadID);
    }
    return api.sendMessage(
      "✅⚡ تم تفعيل وضع السكوت 🔇\n💢😾 بابا أيمن يقول اسكتوا جميعًا! 🔥😎",
      event.threadID
    );
  } else if (args[0] === "ايقاف") {
    module.exports.config.isOn = false;
    const index = module.exports.config.allowedThreads.indexOf(event.threadID);
    if (index > -1) module.exports.config.allowedThreads.splice(index, 1);

    return api.sendMessage(
      "✅ تم ايقاف وضع السكوت 🎉😅 تكلموا براحتكم… بابا أيمن زعل شوي 😂",
      event.threadID
    );
  } else {
    return api.sendMessage(
      "❌ خطأ! اكتب: سكوت تشغيل أو سكوت ايقاف 😎",
      event.threadID
    );
  }
};
