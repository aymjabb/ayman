const axios = require("axios");

module.exports.config = {
  name: "سيرا",
  version: "5.1.0",
  hasPermssion: 0,
  credits: "عمر & سيرا تشان",
  description: "تحدث مع سيرا تشان اللطيفة 🐱✨",
  commandCategory: "الذكاء الاصطناعي",
  usages: "[تشغيل/ايقاف/نص]",
  cooldowns: 2
};

const emojis = ["🐱", "😺", "✨", "💫", "🎀", "🐾"];
function getRandomEmoji(count = 1) {
  let res = "";
  for (let i = 0; i < count; i++) res += emojis[Math.floor(Math.random() * emojis.length)];
  return res;
}

async function talkAI(message) {
  try {
      // تم تغيير الرابط لضمان استجابة أسرع وأفضل
      const res = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=ar&message=${encodeURIComponent(message)}&filter=true`);
      return res.data.success ? res.data.success : null;
  } catch (err) {
      return null;
  }
}

module.exports.onLoad = async function () {
  if (!global.sira_chat) global.sira_chat = new Map();
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;
  if (!global.sira_chat || !global.sira_chat.has(threadID)) return;
  if (senderID == api.getCurrentUserID() || !body || body.startsWith(".")) return;

  const response = await talkAI(body);
  if (response) {
      const finalMsg = `✨ ${response} ${getRandomEmoji()}`;
      return api.sendMessage(finalMsg, threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  if (!global.sira_chat) global.sira_chat = new Map();

  if (args.length == 0) return api.sendMessage(`هاي! أنا سيرا تشان ${getRandomEmoji()}\n\nللتحدث معي:\n✨ .سيرا تشغيل (عشان أرد على الكل)\n✨ .سيرا ايقاف (عشان أرتاح شوي)`, threadID, messageID);

  switch (args[0].toLowerCase()) {
    case "تشغيل":
      global.sira_chat.set(threadID, true);
      return api.sendMessage(`🐾 تدااااا! تم تشغيل سيرا تشان في المجموعة، رح أرد على رسائلكم الحين! ✨`, threadID, messageID);
    case "ايقاف":
      global.sira_chat.delete(threadID);
      return api.sendMessage(`😺 أوكي يا عسل، سيرا رح تروح تنام شوي.. أشوفكم على خير! 💫`, threadID, messageID);
    default:
      const response = await talkAI(args.join(" "));
      if (!response) return api.sendMessage(`🥺 سيرا ما فهمت قصدك.. ممكن تعيد؟`, threadID, messageID);
      return api.sendMessage(`✨ ${response} ${getRandomEmoji()}`, threadID, messageID);
  }
};
