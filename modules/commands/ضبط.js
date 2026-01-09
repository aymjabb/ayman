module.exports.config = {
  name: "ضبط",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Sera Chan",
  description: "تغيير إعدادات الكروب بسرعة",
  commandCategory: "إدارة",
  usages: "ضبط اسم [الاسم الجديد] / ضبط كنية [الكنية]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const action = args[0];
  const content = args.slice(1).join(" ");

  if (action == "اسم") {
    api.setTitle(content, threadID);
    return api.sendMessage(`✅ تم تغيير اسم المجموعة إلى: ${content}`, threadID);
  }

  if (action == "كنية") {
    const { mentions, type, messageReply } = event;
    let targetID = (type == "message_reply") ? messageReply.senderID : Object.keys(mentions)[0];
    let name = args.slice(2).join(" "); // تخطي أول كلمتين
    api.setUserNickname(name, threadID, targetID);
    return api.sendMessage("✅ تم تغيير الكنية بنجاح.", threadID);
  }

  return api.sendMessage("⚙️ خيارات الضبط: (اسم / كنية)", threadID, messageID);
};
