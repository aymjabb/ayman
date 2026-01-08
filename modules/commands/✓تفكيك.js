module.exports.config = {
  name: "تفكيك",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "لعبة تفكيك الكلمات - نسخة مرتبة",
  commandCategory: "العاب",
  cooldowns: 0
};

const questions = [{ question: "شجرة", answer: "ش ج ر ة" }, { question: "قمر", answer: "ق م ر" }];

module.exports.handleReply = async function ({ api, event, handleReply, Users, Currencies }) {
  const { body, senderID, threadID } = event;
  const name = await Users.getNameUser(senderID);

  if (Date.now() > handleReply.endTime) {
    api.unsendMessage(handleReply.messageID);
    return api.sendMessage(`⏰ انتهى الوقت يا ${name}!`, threadID);
  }

  if (body.trim() === handleReply.correctAnswer) {
    Currencies.increaseMoney(senderID, 50);
    api.unsendMessage(handleReply.messageID);
    return api.sendMessage(`✅ بطل! فككت الكلمة بنجاح.\n💰 الجائزة: 50 دولار.`, threadID);
  } else {
    return api.sendMessage(`❌ خطأ! فككها مع مسافات (مثال: أ ب ج).`, threadID);
  }
};

module.exports.run = async function ({ api, event }) {
  const item = questions[Math.floor(Math.random() * questions.length)];
  const msg = `🎮 لـعـبـة الـتـفـكـيـك\n──────────────────\nفكك الكلمة التالية: ✨ [ ${item.question} ]\n──────────────────\n⏱️ الوقت: 15 ثانية!`;
  
  return api.sendMessage(msg, event.threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      correctAnswer: item.answer,
      endTime: Date.now() + 15000
    });
  });
};
