const DEV = ["61577861540407"]; // ايديك

// كلمات سب 18+
const BAD_WORDS = [
  "كسمك","كسم","قحبة","شرموطة","زب","طيز","كس","منيك",
  "جماع","نيك","لبوة","متناك","عاهرة","احا","خرا"
];

// تخزين مؤقت داخل الذاكرة
const memory = {};

module.exports.config = {
  name: "سبام",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Sera Chan",
  description: "حماية شاملة: سب + سبام + منع التعديلات",
  commandCategory: "حماية",
  usages: ".سبام",
  cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
  return api.sendMessage(
    "🛡️ سيرا تشان فعّلت الحماية الكاملة\n" +
    "🚫 سب | 🔁 تكرار | 🧱 تعديل = طرد فوري",
    event.threadID,
    event.messageID
  );
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, senderID, body, logMessageType } = event;
  if (!threadID || !senderID) return;
  if (DEV.includes(senderID)) return;

  if (!memory[threadID]) memory[threadID] = {};
  if (!memory[threadID][senderID]) {
    memory[threadID][senderID] = { last: "", count: 0 };
  }

  /* ===== منع السب ===== */
  if (body) {
    const clean = body.toLowerCase().replace(/[\s\W]/g, "");

    if (BAD_WORDS.some(w => clean.includes(w))) {
      await api.sendMessage("🚫 سب ممنوع — سيرا تشان طردتك", threadID);
      return api.removeUserFromGroup(senderID, threadID);
    }

    /* ===== منع التكرار ===== */
    if (memory[threadID][senderID].last === clean) {
      memory[threadID][senderID].count++;
    } else {
      memory[threadID][senderID].last = clean;
      memory[threadID][senderID].count = 1;
    }

    if (memory[threadID][senderID].count >= 3) {
      await api.sendMessage("🔁 سبام مرفوض — طرد فوري", threadID);
      return api.removeUserFromGroup(senderID, threadID);
    }
  }

  /* ===== منع التعديلات ===== */
  const BLOCK = [
    "log:thread-name",
    "log:thread-image",
    "log:thread-icon",
    "log:thread-theme",
    "log:thread-nickname",
    "log:thread-admins"
  ];

  if (BLOCK.includes(logMessageType)) {
    await api.sendMessage(
      "🧱 محاولة تعديل الكروب\n❌ سيرا تشان تمنع العبث",
      threadID
    );
    return api.removeUserFromGroup(senderID, threadID);
  }
};
