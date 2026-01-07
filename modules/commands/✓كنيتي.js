const DEV = ["61577861540407"]; // ايدي المطور

module.exports.config = {
  name: "كنيةثابتة",
  version: "1.0.0",
  hasPermssion: 2, // 2 = المطور فقط يمكن تغييره
  credits: "Sera Chan",
  description: "يثبت كنية معينة للمطور ويمنع تعديلها من أي شخص",
  commandCategory: "حماية",
  usages: ".كنيةثابتة",
  cooldowns: 0
};

const fixedNickname = "𝙣𝙥𝙘 𝙤𝙛𝙛𝙡𝙞𝙣𝙚"; // الكنية الثابتة

module.exports.handleEvent = async function({ api, event }) {
  const { logMessageType, threadID, senderID } = event;

  if (logMessageType !== "log:thread-nickname") return; // فقط تغييرات الكنية
  if (DEV.includes(senderID)) return; // المطور مسموح له

  try {
    await api.changeNickname(fixedNickname, threadID, api.getCurrentUserID());
    api.sendMessage(`⚡ لا يمكنك تغيير كنيتي! تم استرجاع الكنية إلى "${fixedNickname}" 😼`, threadID);
  } catch (err) {
    console.log("❌ خطأ في إعادة الكنية:", err.message);
  }
};
