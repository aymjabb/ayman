const SERA = require("../seraCore");

module.exports.handleEvent = async function ({ api, event }) {
  const {
    senderID,
    threadID,
    body,
    logMessageType,
    logMessageData,
    author
  } = event;

  /* ======================
     📤 تسجيل المطرودين/الخارجين
     ====================== */
  if (logMessageType === "log:unsubscribe") {
    const uid = logMessageData.leftParticipantFbId;

    const type =
      author && author !== uid ? "KICK" : "LEFT";

    SERA.LEFT_LOG.push({
      id: uid,
      type,
      by: author || "system",
      time: Date.now()
    });
    return;
  }

  /* ======================
     تجاهل الأوامر والمالك
     ====================== */
  if (!body || body.startsWith(".")) return;
  if (senderID === SERA.OWNER) return;

  /* ======================
     🔇 الصامتين
     ====================== */
  if (SERA.SILENT[senderID]) {
    return api.sendMessage(
      SERA.MODE === "DEVIL"
        ? "☠️ قلت لك… أنت صامت."
        : "🔇 أنت صامت مؤقتًا.",
      threadID
    );
  }

  /* ======================
     👁️ المراقبة + المخالفات
     ====================== */
  if (SERA.WATCH[senderID]) {
    SERA.STRIKES[senderID] =
      (SERA.STRIKES[senderID] || 0) + 1;

    if (SERA.STRIKES[senderID] >= SERA.MAX_STRIKES) {
      SERA.SILENT[senderID] = true;
      return api.sendMessage(
        "☠️ تجاوزت الحد.\n🔇 تم إسكاتك.",
        threadID
      );
    }

    return api.sendMessage(
      `⚠️ مخالفة رقم ${SERA.STRIKES[senderID]}`,
      threadID
    );
  }

  /* ======================
     👁️ وضع الرعب (30%)
     ====================== */
  if (SERA.MODE === "DEVIL" && Math.random() < 0.3) {
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
