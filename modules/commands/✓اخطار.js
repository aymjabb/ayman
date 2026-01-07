module.exports.config = {
  name: "اخطار",
  version: "0.0.3",
  hasPermssion: 2,
  credits: "عمر | Sera Chan",
  description: "ارسال رسالة تحذير أو إخطار للمستخدمين أو الكروبات من حساب البوت",
  commandCategory: "المطور",
  usages: ".اخطار [للمستخدم/للكروب] ايدي + الرسالة",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args, utils }) {
  const moment = require("moment-timezone");

  // قائمة المطورين المسموح لهم باستخدام الأمر
  const permission = [
    "61577861540407", // أنت
    // يمكن إضافة IDs أخرى هنا
  ];

  if (!permission.includes(event.senderID)) 
    return api.sendMessage("❌ ما عندك صلاحية لاستخدام هذا الأمر.", event.threadID, event.messageID);

  const gio = moment.tz("Asia/Baghdad").format("HH:mm:ss D/MM/YYYY");
  const msg = args.splice(2).join(" ");

  // تحضير النص داخل صندوق زخرفي
  const boxMsg = `╭─•⊰ اخطار •⊱•─╮\n${msg}\n╰────────────╯\n⏰ ${gio}`;

  if (args[0] === "للمستخدم") {
    await api.sendMessage(boxMsg, args[1]);
    return api.sendMessage(`✅ تم إرسال الإخطار للعضو: ${args[1]}`, event.threadID, event.messageID);
  } else if (args[0] === "للكروب") {
    await api.sendMessage(boxMsg, args[1]);
    return api.sendMessage(`✅ تم إرسال الإخطار إلى المجموعة: ${args[1]}`, event.threadID, event.messageID);
  } else {
    return utils.throwError("sendmsg", event.threadID, event.messageID);
  }
};
