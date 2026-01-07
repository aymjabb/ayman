const SERA = require("../seraCore");

module.exports.handleEvent = async function({ api, event }) {
  const { senderID, threadID, body } = event;

  // تجاهل الرسائل الفارغة أو الأوامر
  if (!body || body.startsWith(".")) return;

  // تجاهل المالك
  if (senderID === SERA.OWNER) return;

  // 🔇 منع الكلام إذا كان مسكوت
  if (SERA.SILENT[senderID]) {
    return api.sendMessage(
      SERA.MODE === "DEVIL"
        ? "☠️ قلت لك… أنت صامت."
        : "🔇 أنت صامت مؤقتًا.",
      threadID
    );
  }

  // 👁️ وضع الرعب (احتمال 30% فقط)
  if (SERA.MODE === "DEVIL") {
    if (Math.random() > 0.3) return;

    const replies = [
      "👁️ سيرا تراك.",
      "🩸 تم تسجيل رسالتك.",
      "☠️ انتبه لكلامك.",
      "⛧ لا تعيدها."
    ];

    return api.sendMessage(
      replies[Math.floor(Math.random() * replies.length)],
      threadID
    );
  }
};
