module.exports.config = {
  name: "حماية",
  version: "FINAL-5.0.0",
  hasPermssion: 1,
  credits: "عمر & سيرا تشان 🐱",
  description: "حماية تلقائية + أمر تحكم يدوي",
  usages: ".حماية [تشغيل|ايقاف]",
  commandCategory: "المطور",
  cooldowns: 0
};

// ===== المعرفات =====
const OWNER_ID = "61577861540407"; // بابا 😻
const BOT_ID   = "61586019840418"; // سيرا تشان 🐱

// ===== الحالة الافتراضية =====
let protectionEnabled = true;

// ===== إيموجي =====
const cats = ["🐱","😺","😻","😸","😾"];
const extras = ["✨","❤️‍🔥","🐾","😂"];

const mood = () =>
  cats[Math.floor(Math.random()*cats.length)] +
  extras[Math.floor(Math.random()*extras.length)];

const sera = (t) => `「سيرا تشان」 ${t} ${mood()}`;

// ===================================================
// 🔥 أمر .حماية (تشغيل / ايقاف)
// ===================================================
module.exports.run = async ({ api, event, args }) => {
  const { threadID, senderID } = event;

  if (senderID !== OWNER_ID)
    return api.sendMessage(sera("هذا الأمر لِبابا فقط 😾"), threadID);

  const action = args[0];

  if (!["تشغيل","ايقاف"].includes(action))
    return api.sendMessage(
      sera("الاستخدام:\n.حماية تشغيل\n.حماية ايقاف"),
      threadID
    );

  protectionEnabled = action === "تشغيل";

  return api.sendMessage(
    sera(`تم ${action} الحماية بنجاح بابا 😻`),
    threadID
  );
};

// ===================================================
// 🛡️ الحماية التلقائية (بدون تفعيل)
// ===================================================
module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, logMessageType, logMessageData, senderID } = event;

  if (!protectionEnabled) return;

  // ===== عند دخول سيرا تشان =====
  if (logMessageType === "log:subscribe") {
    const joined = logMessageData?.addedParticipants?.some(
      u => u.userFbId == BOT_ID
    );
    if (joined) {
      await api.changeAdminStatus(threadID, BOT_ID, true);
      return api.sendMessage("ايمنننننن ✅😸❤️‍🔥", threadID);
    }
  }

  // ===== محاولة إنزال أو طرد =====
  if (logMessageType === "log:thread-admins") {
    const target = logMessageData?.TARGET_ID;
    const action = logMessageData?.ADMIN_EVENT;

    if (
      action === "remove_admin" &&
      (target === OWNER_ID || target === BOT_ID) &&
      senderID !== OWNER_ID
    ) {
      try {
        // رجوع فوري
        await api.changeAdminStatus(threadID, OWNER_ID, true);
        await api.changeAdminStatus(threadID, BOT_ID, true);

        // إنزال المعتدي وطرده
        await api.changeAdminStatus(threadID, senderID, false);
        await api.removeUserFromGroup(senderID, threadID);

        return api.sendMessage(
          sera("😹 حاولت تلعب؟ القطة عضّتك وطردتك"),
          threadID
        );
      } catch (e) { console.error(e); }
    }
  }
};

// ===================================================
// 🐱 أمر خاص: إنزال سيرا تشان
// ===================================================
module.exports.handleReply = async ({ api, event }) => {
  const { body, senderID, threadID } = event;

  if (senderID !== OWNER_ID) return;

  if (body === ".حبيبتي انزلي") {
    protectionEnabled = false;
    await api.changeAdminStatus(threadID, BOT_ID, false);
    return api.sendMessage("😿 حاضر بابا… نزلت نفسي", threadID);
  }

  if (body === ".حبيبتي اطلعي") {
    protectionEnabled = true;
    await api.changeAdminStatus(threadID, BOT_ID, true);
    return api.sendMessage("😺 رجعت أدمن بابا!", threadID);
  }
};
