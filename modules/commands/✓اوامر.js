const fs = require("fs-extra");

module.exports.config = {
  name: "اوامر",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "قائمة أوامر البوت المطورة مع نظام الفئات الذكي",
  commandCategory: "النظام",
  usages: ".اوامر",
  cooldowns: 5
};

// إعداد الفئات مع كافة الأوامر الجديدة والقديمة
const categories = {
  "🛡️ الإدارة والسيطرة": ["مح", "كتم", "قفل", "تحذير", "تبليغ", "كشف", "تصفية", "ترحيب", "ضبط"],
  "👑 تحكم المطور": ["تحكم", "حظر", "نشر", "رفع", "فحص", "ايدي", ".نظام تكاملي تشغيل", ".نظام تكاملي ايقاف"],
  "🎮 الألعاب والترفيه": ["مسابقة", "متجر", "ترتيب", "لوخيروك", "اقتباسات", "اذكار", "نكت", "معلومات", "تحدي"],
  "🤖 الذكاء والصور": ["تخييلي", "سلاحي", "اصفعي", "حضن", "معلمي", "المطور", "مزخرف"],
  "✨ متفرقات": ["مستوى", "اكشن", "هدية", "شخصية", "كنية", "اضحك", "مزاح"]
};

const OWNER_ID = "61577861540407";

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  let msg = `╭━━━〔 𝑺𝑬𝑹𝑨 𝑪𝑯𝑨𝑵 〕━━━╮\n\n`;
  msg += `✨ أهلاً بك يا زعيم في قائمة التحكم ✨\n`;
  msg += `الرجاء اختيار رقم الفئة لعرض الأوامر:\n\n`;

  const keys = Object.keys(categories);
  keys.forEach((cat, i) => {
    msg += ` 【 ${i + 1} 】⟢ ${cat}\n`;
  });

  msg += `\n──────────────────\n`;
  msg += `💡 رد على الرسالة برقم الفئة\n`;
  msg += `💻 المطور: أيمن 🐾\n`;
  msg += `╰━━━━━━━━━━━━━━━━╯`;

  return api.sendMessage(msg, threadID, (err, info) => {
    global.client.handleReply.push({
      name: "اوامر",
      messageID: info.messageID,
      author: event.senderID
    });
  }, messageID);
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, body, senderID } = event;
  if (handleReply.name !== "اوامر") return;

  const keys = Object.keys(categories);
  const choice = parseInt(body.trim());

  // العودة للقائمة الرئيسية
  if (choice === 0) {
    return api.sendMessage("🔄 يرجى كتابة .اوامر لفتح القائمة من جديد.", threadID);
  }

  if (!isNaN(choice) && choice >= 1 && choice <= keys.length) {
    const categoryName = keys[choice - 1];
    const commandsList = categories[categoryName];

    let msg = `┏━━━━〔 ${categoryName} 〕━━━━┓\n\n`;
    msg += `🔹 الأوامر المتاحة:\n`;
    msg += `✨ ${commandsList.join(" ✨ ")}\n\n`;
    msg += `──────────────────\n`;
    msg += `📌 للرجوع أرسل [ 0 ]\n`;
    msg += `🐾 سـيـرا تـشـان تـحـت أمـرك\n`;
    msg += `┗━━━━━━━━━━━━━━━━┛`;

    return api.sendMessage(msg, threadID, (err, info) => {
      global.client.handleReply.push({
        name: "اوامر",
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);
  } else {
    return api.sendMessage("❌ رقم غير صالح، اختر من القائمة أعلاه.", threadID, messageID);
  }
};
