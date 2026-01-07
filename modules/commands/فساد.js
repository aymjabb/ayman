const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "فساد",
  version: "1.0.0",
  hasPermssion: 2, // فقط المطور
  credits: "سيرا تشان",
  description: "إعطاء أو خصم فلوس لمستخدم أو تحويل لشخص بالرد أو التاغ",
  commandCategory: "النظام",
  usages: ".فساد اني 1000 | .فساد @الشخص 500",
  cooldowns: 3
};

const dataPath = path.join(__dirname, "cache/currency.json");

// تأكد من وجود ملف العملات
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}));

module.exports.run = async function({ api, event, args, Users }) {
  const { threadID, messageID, senderID, mentions, messageReply } = event;
  const DEV = ["61577861540407"]; // ايديك كمطور

  if (!DEV.includes(senderID)) {
    return api.sendMessage("❌ هذا الأمر للمطور فقط!", threadID, messageID);
  }

  if (args.length < 2) return api.sendMessage("❌ صيغة خاطئة! مثال: .فساد اني 500 أو .فساد @الشخص 500", threadID, messageID);

  const action = args[0].toLowerCase(); // "اني" أو اسم الشخص
  const amount = parseInt(args[1]);

  if (isNaN(amount)) return api.sendMessage("❌ المبلغ يجب أن يكون رقم!", threadID, messageID);

  let userId;
  if (action === "اني") {
    userId = senderID; // يعطيك انت
  } else if (Object.keys(mentions).length > 0) {
    userId = Object.keys(mentions)[0]; // التاغ على شخص
  } else if (messageReply && messageReply.senderID) {
    userId = messageReply.senderID; // الرد على شخص
  } else {
    return api.sendMessage("❌ لم يتم تحديد المستخدم!", threadID, messageID);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  if (!data[userId]) data[userId] = 0;

  data[userId] += amount; // اضافة المال

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  const targetName = await Users.getNameUser(userId);

  return api.sendMessage(`💰 تم إضافة ${amount} دولار إلى حساب ${targetName}\n💸 رصيد جديد: ${data[userId]}`, threadID, messageID);
};
