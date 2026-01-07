const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "ارجاع",
  version: "1.1.0",
  hasPermssion: 2, // 1 = المشرفين، 2 = المطور
  credits: "Sera Chan",
  description: "يرجع أي شخص يخرج من الكروب ويرحب به برسالة دلع",
  commandCategory: "الادارة",
  usages: ".ارجاع تشغيل/ايقاف",
  cooldowns: 5
};

// ✅ حفظ حالة التفعيل دائمًا
const dataPath = path.join(__dirname, "cache", "return.json");
let enabledGroups = {};
if (fs.existsSync(dataPath)) enabledGroups = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
function save() { fs.writeFileSync(dataPath, JSON.stringify(enabledGroups, null, 2)); }

module.exports.run = async function({ api, event, args }) {
  const { threadID } = event;

  if (!args[0]) return api.sendMessage("❌ استخدم: .ارجاع تشغيل/ايقاف", threadID);
  
  if (args[0].toLowerCase() === "تشغيل") {
    enabledGroups[threadID] = true;
    save();
    return api.sendMessage("✅ تم تفعيل نظام إرجاع الأعضاء في هذه المجموعة", threadID);
  }

  if (args[0].toLowerCase() === "ايقاف") {
    enabledGroups[threadID] = false;
    save();
    return api.sendMessage("⚠️ تم تعطيل نظام إرجاع الأعضاء في هذه المجموعة", threadID);
  }

  return api.sendMessage("❌ الخيار غير معروف، استخدم تشغيل أو ايقاف", threadID);
};

// الحدث
module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, logMessageType, logMessageData } = event;

  if (!enabledGroups[threadID]) return;

  // كل أنواع الخروج
  if (logMessageType === "log:user-remove" || logMessageType === "log:user-left") {
    const leftUserID = logMessageData.leftParticipantFbId || logMessageData.userID;

    setTimeout(async () => {
      try {
        await api.addUserToGroup(leftUserID, threadID);

        const name = await Users.getNameUser(leftUserID);
        await api.sendMessage(
          `🥳 أهلاً مجددًا ${name}! لا تحاول الهرب 😹\nسيرا تشان تقول: "تعال نلعب!"`,
          threadID
        );
      } catch (e) {
        console.log("❌ لم أستطع إعادة العضو:", e.message);
      }
    }, 4000); // انتظر 4 ثواني لضمان قبول الإضافة
  }
};
