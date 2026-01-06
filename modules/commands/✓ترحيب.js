module.exports.config = {
  name: "ترحيب_تلقائي",
  version: "1.1.0",
  hasPermssion: 1,
  credits: "عمر",
  description: "ترحيب تلقائي مزخرف عند انضمام عضو جديد للمجموعة",
  commandCategory: "مسؤولي المجموعات",
  usages: "ترحيب_تلقائي",
  cooldowns: 0
};

module.exports.run = async function({ api, event, Threads }) {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;

  // تبديل حالة الترحيب
  if (typeof data["joinNoti"] === "undefined" || data["joinNoti"] === true) data["joinNoti"] = false;
  else data["joinNoti"] = true;

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  return api.sendMessage(`✅ ${(data["joinNoti"] === false) ? "تم ايقاف" : "تم تفعيل"} الترحيب التلقائي المزخرف عند دخول أي عضو جديد!`, threadID, messageID);
};

// مراقبة دخول العضو الجديد
module.exports.handleEvent = async function({ api, event, Threads, Users }) {
  const { threadID, logMessageType, addedParticipants } = event;

  if (logMessageType !== "log:subscribe") return; // فقط دخول عضو جديد

  let data = global.data.threadData.get(threadID) || {};
  if (!data.joinNoti) return; // إذا الترحيب مطفأ لا نفعل شيء

  const decorations = [
    "✨🌸🎉", "🔥🌟💫", "💖🎊🌈", "🌹🎆🎇", "🌼🌸🌺", "⚡🎉✨", "💎🌟🎊"
  ];

  for (const user of addedParticipants) {
    const userName = await Users.getNameUser(user.userFbId || user.id);
    const deco = decorations[Math.floor(Math.random() * decorations.length)];
    const message = `
${deco} ░حـــــمـــــد للــــــــله░ ${deco}

🎊 أهلاً وسهلاً بـ » ${userName} « 🎊
💫 نحن سعداء بانضمامك لمجموعتنا 💫

🌟 استمتع معنا ⚡ وكن جزء من المرح 🎉
`;
    api.sendMessage(message, threadID);
  }
};
