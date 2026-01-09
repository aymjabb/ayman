const fs = require("fs-extra");

module.exports.config = {
  name: "اوامر",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "قائمة أوامر البوت المطورة مع نظام الفئات الذكي",
  commandCategory: "النظام",
  usages: ".اوامر",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  // إعداد الفئات والأوامر
  const categories = {
    "🛡️ الإدارة والسيطرة": ["مح", "كتم", "قفل", "تحذير", "تبليغ", "كشف", "تصفية", "ترحيب", "ضبط"],
    "👑 تحكم المطور": ["تحكم", "حظر", "نشر", "رفع", "فحص", "ايدي"],
    "🎮 الألعاب والترفيه": ["مسابقة", "متجر", "ترتيب", "لوخيروك", "اقتباسات", "اذكار", "نكت", "تحدي"],
    "🤖 الذكاء والصور": ["تخييلي", "سلاحي", "اصفعي", "حضن", "معلمي", "المطور", "مزخرف"],
    "✨ متفرقات": ["مستوى", "اكشن", "هدية", "شخصية", "كنية", "اضحك", "مزاح"]
  };

  const keys = Object.keys(categories);
  
  let msg = `╭━━━〔 𝑺𝑬𝑹𝑨 𝑪𝑯𝑨𝑵 〕━━━╮\n\n`;
  msg += `✨ أهلاً بك يا زعيم في قائمة التحكم ✨\n`;
  msg += `الرجاء اختيار رقم الفئة لعرض الأوامر:\n\n`;

  keys.forEach((cat, i) => {
    msg += ` 【 ${i + 1} 】⟢ ${cat}\n`;
  });

  msg += `\n──────────────────\n`;
  msg += `💡 رد على الرسالة برقم الفئة\n`;
  msg += `💻 المطور: أيمن 🐾\n`;
  msg += `╰━━━━━━━━━━━━━━━━╯`;

  return api.sendMessage(msg, threadID, (err, info) => {
    if (err) return console.error(err);
    // تأكد من وجود نظام الردود في البوت
    if (global.client && global.client.handleReply) {
      global.client.handleReply.push({
        name: "اوامر", // يجب أن يطابق اسم الأمر في الـ config
        messageID: info.messageID,
        author: senderID,
        categories: categories // تمرير البيانات للرد
      });
    }
  }, messageID);
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, body, senderID } = event;

  // التحقق من أن صاحب الأمر هو من يرد
  if (senderID !== handleReply.author) return;

  const categories = handleReply.categories;
  const keys = Object.keys(categories);
  const choice = parseInt(body.trim());

  // العودة للقائمة الرئيسية (إعادة تشغيل الأمر)
  if (choice === 0) {
    api.unsendMessage(handleReply.messageID);
    return api.sendMessage("🔄 جاري العودة للقائمة...", threadID, () => {
        return module.exports.run({ api, event });
    });
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

    // حذف القائمة القديمة لإبقاء الشات نظيفاً
    api.unsendMessage(handleReply.messageID);

    return api.sendMessage(msg, threadID, (err, info) => {
      global.client.handleReply.push({
        name: "اوامر",
        messageID: info.messageID,
        author: senderID,
        categories: categories
      });
    }, messageID);
  } else {
    return api.sendMessage("❌ رقم غير صالح، اختر من القائمة (1 إلى 5) أو 0 للرجوع.", threadID, messageID);
  }
};
