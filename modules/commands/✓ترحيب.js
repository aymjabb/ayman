module.exports.config = {
  name: "ترحيب",
  version: "2.5.0",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "ترحيب تلقائي عفوي ومنظم عند دخول الأعضاء الجدد",
  commandCategory: "نظام"
};

module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, logMessageType, logMessageData } = event;

  // فحص إذا كان الحدث هو دخول عضو جديد
  if (logMessageType === "log:subscribe") {
    const addedParticipants = logMessageData.addedParticipants;
    
    for (const participant of addedParticipants) {
      const id = participant.userFbId;
      const name = await Users.getNameUser(id);
      
      // رسالة عفوية، مرتبة، وقليلة الإيموجيات لعدم التشويش
      const msg = `
يا هلا والله بـ ${name}! ✨

نورتنا بوجودك في مجموعتنا المتواضعة.. 
خذ راحتك المكان مكانك، بس لا تنسى تطلع على القوانين عشان تضل منورنا دايماً 🌸

أتمنى لك وقت ممتع معانا! 🐾
──────────────────
👑 مـطـور الـنـظـام: أيـمـن الـبـكـري
`;
      
      // إرسال الترحيب فوراً
      api.sendMessage(msg, threadID);
    }
  }
};

// هذا الأمر يعمل تلقائياً ولا يحتاج لكتابة .ترحيب
module.exports.run = async function({}) {
  // لا يحتاج لشيء هنا
};
