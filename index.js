// ==================== index.js ====================

const fs = require("fs");
const path = require("path");
const { Client } = require("some-bot-library"); // غيّر لمكتبة البوت الحقيقية
require("./modules/autoRefresh");
const SMART = require("./sera/smartSystem");

const bot = new Client();
const OWNER_ID = "61577861540407"; // ايديك

// ----------------- Helper Functions -----------------

function isOwner(id) {
  return id === OWNER_ID;
}

// إرسال رسالة
function sendMsg(threadID, text) {
  bot.sendMessage(text, threadID);
}

// ----------------- Events -----------------

bot.on("message", async (event) => {
  const { senderID, threadID, body, senderName } = event;
  if (!body) return;

  // ---- أوامر الأدمن للتحكم بالنظام ----
  if (isOwner(senderID)) {
    if (body === ".نظام تكاملي تشغيل") {
      SMART.toggleSystem(true);
      return sendMsg(threadID, "✅ تم تشغيل النظام التكاملي");
    }

    if (body === ".نظام تكاملي ايقاف") {
      SMART.toggleSystem(false);
      return sendMsg(threadID, "⛔ تم إيقاف النظام التكاملي");
    }
  }

  // ---- تجاهل الرسائل لو النظام متوقف ----
  if (!SMART.isEnabled()) return;

  // ---- تهيئة المستخدم وتسجيل التفاعل ----
  const name = senderName || "User";
  SMART.initUser(senderID, name);
  SMART.logInteraction(senderID, body);

  // ---- الذكاء التفاعلي ----
  const users = require("./sera/users.json");
  const user = users[senderID];
  if (!user) return;

  const question = SMART.getSmartQuestion(user);
  if (question && !body.startsWith(".")) {
    sendMsg(threadID, question);
  }

  if (question) SMART.applyAnswer(senderID, body);
});

// ----------------- تشغيل البوت -----------------

bot.login("TOKEN"); // حط التوكن الحقيقي هنا

console.log("🚀 البوت شغّال! النظام التكاملي مدمج مع سيرا");

// ==================== END index.js ====================
