const fs = require("fs-extra");

module.exports.config = {
  name: "اوامر",
  version: "3.2.0",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "Menu with category selection",
  commandCategory: "system",
  usages: ".اوامر",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID } = event;

  // تعريف النصوص العربية بعيداً عن هيكل الكود الرئيسي لتجنب أخطاء التشفير
  const t = {
    title: "𝑺𝑬𝑹𝑨 𝑪𝑯𝑨𝑵",
    welcome: "أهلاً بك يا زعيم في قائمة التحكم",
    select: "الرجاء اختيار رقم الفئة لعرض الأوامر",
    dev: "المطور: أيمن",
    replyMsg: "💡 رد على الرسالة برقم الفئة",
    c1: "🛡️ الإدارة والسيطرة",
    c2: "👑 تحكم المطور",
    c3: "🎮 الألعاب والترفيه",
    c4: "🤖 الذكاء والصور",
    c5: "✨ متفرقات"
  };

  const categories = {};
  categories[t.c1] = ["مح", "كتم", "قفل", "تحذير", "تبليغ", "كشف", "تصفية", "ترحيب", "ضبط"];
  categories[t.c2] = ["تحكم", "حظر", "نشر", "رفع", "فحص", "ايدي"];
  categories[t.c3] = ["مسابقة", "متجر", "ترتيب", "لوخيروك", "اقتباسات", "اذكار", "نكت", "تحدي"];
  categories[t.c4] = ["تخييلي", "سلاحي", "اصفعي", "حضن", "معلمي", "المطور", "مزخرف"];
  categories[t.c5] = ["مستوى", "اكشن", "هدية", "شخصية", "كنية", "اضحك", "مزاح"];

  const keys = Object.keys(categories);
  
  let msg = `╭━━━〔 ${t.title} 〕━━━╮\n\n`;
  msg += `✨ ${t.welcome} ✨\n`;
  msg += `${t.select}:\n\n`;

  keys.forEach((cat, i) => {
    msg += ` 【 ${i + 1} 】⟢ ${cat}\n`;
  });

  msg += `\n──────────────────\n`;
  msg += `${t.replyMsg}\n`;
  msg += `💻 ${t.dev} 🐾\n`;
  msg += `╰━━━━━━━━━━━━━━━━╯`;

  return api.sendMessage(msg, threadID, (err, info) => {
    if (err) return console.error(err);
    if (global.client && global.client.handleReply) {
      global.client.handleReply.push({
        name: "اوامر",
        messageID: info.messageID,
        author: senderID,
        categories: categories
      });
    }
  }, messageID);
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, body, senderID } = event;

  if (senderID !== handleReply.author) return;

  const categories = handleReply.categories;
  const keys = Object.keys(categories);
  const choice = parseInt(body.trim());

  if (choice === 0) {
    if (api.unsendMessage) api.unsendMessage(handleReply.messageID);
    return module.exports.run({ api, event });
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

    if (api.unsendMessage) api.unsendMessage(handleReply.messageID);

    return api.sendMessage(msg, threadID, (err, info) => {
      global.client.handleReply.push({
        name: "اوامر",
        messageID: info.messageID,
        author: senderID,
        categories: categories
      });
    }, messageID);
  } else {
    const errorMsg = "❌ رقم غير صالح، اختر من القائمة أو 0 للرجوع";
    return api.sendMessage(errorMsg, threadID, messageID);
  }
};
