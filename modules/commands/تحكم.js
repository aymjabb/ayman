const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");

module.exports.config = {
  name: "تحكم",
  version: "5.0.0",
  hasPermssion: 2, // للمطور فقط
  credits: "Ayman & Sera",
  description: "أدوات السيطرة الملكية للمطور (تحديث، جلب ملفات، تنفيذ أوامر)",
  commandCategory: "المطور",
  usages: "[ملف / تحديث / أمر / غادر]",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args, Threads }) => {
  const { threadID, messageID, senderID } = event;
  const DEV_ID = "61577861540407"; // أيديك يا زعيم

  if (senderID !== DEV_ID) return api.sendMessage("❌ هذا الأمر مخصص لسيادة المطور أيمن فقط.", threadID, messageID);

  const action = args[0];

  // 1. جلب أي ملف من ملفات البوت (لسرعة التعديل)
  if (action === "ملف") {
    const fileName = args[1];
    if (!fileName) return api.sendMessage("📩 أرسل اسم الملف، مثال: تحكم ملف سبام.js", threadID, messageID);
    const pathFile = path.join(__dirname, fileName);
    if (!fs.existsSync(pathFile)) return api.sendMessage("❌ الملف غير موجود.", threadID, messageID);
    return api.sendMessage({ body: `📄 ملف: ${fileName}`, attachment: fs.createReadStream(pathFile) }, threadID, messageID);
  }

  // 2. تحديث البوت (Restart)
  if (action === "تحديث") {
    await api.sendMessage("🔄 جاري إعادة تشغيل أنظمة سيرا تشان.. سأعود أقوى!", threadID);
    process.exit(1); // يقوم بإعادة التشغيل إذا كنت تستخدم PM2 أو مراقب عمليات
  }

  // 3. تنفيذ أمر ترمنال (Terminal Shell)
  if (action === "امر") {
    const cmd = args.slice(1).join(" ");
    if (!cmd) return api.sendMessage("💻 أرسل الأمر المراد تنفيذه في السيرفر.", threadID, messageID);
    exec(cmd, (error, stdout, stderr) => {
      if (error) return api.sendMessage(`❌ خطأ: ${error.message}`, threadID, messageID);
      if (stderr) return api.sendMessage(`⚠️ تنبيه: ${stderr}`, threadID, messageID);
      return api.sendMessage(`✅ النتيجة:\n${stdout}`, threadID, messageID);
    });
  }

  // 4. مغادرة البوت لمجموعة معينة (عن طريق الأيدي)
  if (action === "غادر") {
    const id = args[1] || threadID;
    api.sendMessage("🚀 بأمر من المطور، سيرا تشان تغادر الآن. وداعاً!", id, () => {
        api.removeUserFromGroup(api.getCurrentUserID(), id);
    });
  }

  // 5. إذا لم يرسل خيار، عرض القائمة
  if (!action) {
    const menu = `
👑 أهلاً بك يا زعيم (أيمن)
──────────────────
🛠️ قـائمة الـتـحـكـم الـمـلكيـة:
──────────────────
❶ تحكم ملف [اسم الملف]: لجلب كود أي أمر.
❷ تحكم تحديث: لإعادة تشغيل البوت فوراً.
❸ تحكم امر [الكود]: لتنفيذ أوامر السيرفر.
❹ تحكم غادر [الأيدي]: لمغادرة أي مجموعة.
❺ تحكم نشر [النص]: للنشر في كل المجموعات.
──────────────────
🐾 نظام سيرا تحت أمرك دائماً.
`;
    return api.sendMessage(menu, threadID, messageID);
  }
};
