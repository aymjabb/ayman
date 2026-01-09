const DEV = ["61577861540407"]; // ايديك يا زعيم

// كلمات سب 18+
const BAD_WORDS = [
  "كسمك","كسم","قحبة","شرموطة","زب","طيز","كس","منيك",
  "جماع","نيك","لبوة","متناك","عاهرة","احا","خرا","تعال مص"
];

// تخزين في الذاكرة للتحذيرات والسبام
const memory = {};

module.exports.config = {
  name: "سبام",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "Sera Chan & Ayman",
  description: "حماية شاملة بنظام: تحذير ثم طرد",
  commandCategory: "حماية",
  usages: ".سبام",
  cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
  return api.sendMessage(
    "🛡️ تم تفعيل نظام الحماية المطور\n" +
    "⚠️ تحذير أول.. ثم طرد نهائي 😼\n" +
    "🚫 سب | 🔁 تكرار | 🧱 تعديل",
    event.threadID,
    event.messageID
  );
};

module.exports.handleEvent = async ({ api, event, Users }) => {
  const { threadID, senderID, body, logMessageType, messageID } = event;
  if (!threadID || !senderID) return;
  if (DEV.includes(senderID) || senderID == api.getCurrentUserID()) return;

  if (!memory[threadID]) memory[threadID] = {};
  if (!memory[threadID][senderID]) {
    memory[threadID][senderID] = { last: "", count: 0, warns: 0 };
  }

  const userMemory = memory[threadID][senderID];
  const name = await Users.getNameUser(senderID);

  /* ===== وظيفة تنفيذ العقوبة ===== */
  const punish = async (reason) => {
    userMemory.warns++;
    if (userMemory.warns === 1) {
      api.unsendMessage(messageID); // حذف الرسالة المخالفة
      return api.sendMessage(
        `⚠️ تحذير يا ${name}!\nسبب: ${reason}\nهذه فرصة أخيرة، المرة القادمة طرد! 🐾`,
        threadID
      );
    } else {
      await api.sendMessage(
        `🚀 وداعاً ${name}!\nتجاوزت التحذير وتم طردك بسبب: ${reason} 💥`,
        threadID
      );
      userMemory.warns = 0; // تصفير العداد بعد الطرد
      return api.removeUserFromGroup(senderID, threadID);
    }
  };

  /* ===== 1. منع السب ===== */
  if (body) {
    const clean = body.toLowerCase().replace(/[\s\W]/g, "");
    if (BAD_WORDS.some(w => clean.includes(w))) {
      return punish("استخدام ألفاظ محظورة 🔞");
    }

    /* ===== 2. منع التكرار (السبام) ===== */  
    if (userMemory.last === clean) {  
      userMemory.count++;  
    } else {  
      userMemory.last = clean;  
      userMemory.count = 1;  
    }  

    if (userMemory.count >= 3) {  
      userMemory.count = 0; // تصفير عداد السبام لبدء عداد التحذير  
      return punish("تكرار الكلام (سبام) 🔁");  
    }
  }

  /* ===== 3. منع التعديلات (اسم، صورة، أدمن) ===== */
  const BLOCK = [
    "log:thread-name",
    "log:thread-image",
    "log:thread-icon",
    "log:thread-theme",
    "log:thread-nickname",
    "log:thread-admins"
  ];

  if (BLOCK.includes(logMessageType)) {
    return punish("محاولة العبث بإعدادات الكروب 🧱");
  }
};
