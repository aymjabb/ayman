const fs = require("fs");
const path = require("path");
require("./modules/autoRefresh");

const { Client } = require("some-bot-library");
const bot = new Client();

// ===== دمج الذكاء الماكر =====
const SMART = require("./sera/smartSystem");
const OWNER_ID = "61577861540407";

// التعامل مع الرسائل
bot.on("message", async (event) => {
  const { senderID, threadID, body, senderName } = event;
  if (!body) return;

  // أوامر المطوّر فقط
  if (senderID === OWNER_ID) {
    if (body === ".نظام تكاملي تشغيل") {
      SMART.toggleSystem(true);
      return bot.sendMessage("✅ تم تشغيل النظام التكاملي", threadID);
    }
    if (body === ".نظام تكاملي ايقاف") {
      SMART.toggleSystem(false);
      return bot.sendMessage("⛔ تم إيقاف النظام التكاملي", threadID);
    }
    if (body === ".نظام تكاملي حالة") {
      return bot.sendMessage(`🔹 النظام حالياً: ${SMART.isEnabled() ? "✅ شغال" : "⛔ متوقف"}`, threadID);
    }
    if (body === ".نظام تكاملي تقرير") {
      const top = SMART.getTopUsers();
      let msg = "🏆 أكثر الأعضاء تفاعلاً:\n";
      top.forEach((u,i) => {
        msg += `${i+1}. ${u.nameFB} | نقاط: ${u.points} | أموال: ${u.money}\n`;
      });
      return bot.sendMessage(msg, threadID);
    }
  }

  // إذا النظام متوقف
  if (!SMART.isEnabled()) return;

  // تهيئة المستخدم
  const name = senderName || "User";
  SMART.initUser(senderID, name);

  // تسجيل التفاعل
  SMART.logInteraction(senderID, body);

  // أسئلة ذكية
  const users = require("./sera/users.json");
  const user = users[senderID];
  const q = SMART.getSmartQuestion(user);

  if (q && !body.startsWith(".")) {
    return bot.sendMessage(q, threadID);
  }
  if (q) SMART.applyAnswer(senderID, body);
});

bot.login("TOKEN");
