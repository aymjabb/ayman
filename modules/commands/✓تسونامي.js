module.exports.config = {
  name: "انقلاب",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "حماية إدارية دائمة + تعطيل يدوي",
  commandCategory: "حماية",
  cooldowns: 0
};

// الايديهات المحمية (مستحيل ينزلون)
const PROTECTED = [
  "61586019840418", // سيرا تشان
  "61577861540407" // ايديك
];

// تخزين حالة الإيقاف
const stoppedThreads = new Set();

/* ================== */
/*  أمر الإيقاف فقط   */
/* ================== */
module.exports.run = async ({ api, event }) => {
  const { threadID } = event;

  stoppedThreads.add(threadID);

  return api.sendMessage(
`╭━━━━━━〔 💣 𝗦𝗘𝗥𝗔 〕━━━━━━╮
🚫 تم تعطيل الانقلاب
الكل صار يلعب براحتو
╰━━━━━━━━━━━━━━━━━━━━╯`,
    threadID,
    event.messageID
  );
};

/* ================== */
/*  الحماية التلقائية */
/* ================== */
module.exports.handleEvent = async ({ api, event }) => {
  const { logMessageType, logMessageData, threadID } = event;

  // إذا موقوف في هذا الكروب → تجاهل
  if (stoppedThreads.has(threadID)) return;

  // نراقب فقط تغييرات الأدمن
  if (logMessageType !== "log:thread-admins") return;

  const targetID = String(logMessageData?.TARGET_ID);
  if (!PROTECTED.includes(targetID)) return;

  const info = await api.getThreadInfo(threadID);

  // إنزال كل الأدمنية غير المحميين
  for (const admin of info.adminIDs) {
    if (!PROTECTED.includes(String(admin.id))) {
      try {
        await api.changeAdminStatus(threadID, admin.id, false);
      } catch {}
    }
  }

  // إعادة المحميين أدمن
  for (const id of PROTECTED) {
    try {
      await api.changeAdminStatus(threadID, id, true);
    } catch {}
  }

  api.sendMessage(
`☠️ محاولة فاشلة
👑 سيرا تشان خط أحمر
🧹 تم تنظيف الإدارة`,
    threadID
  );
};
