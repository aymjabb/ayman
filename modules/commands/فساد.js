const fs = require("fs-extra");
const path = require("path");

const dataPath = path.join(__dirname, "cache/currency.json");
if (!fs.existsSync(dataPath)) fs.writeJsonSync(dataPath, {});

module.exports.config = {
  name: "عملات",
  version: "2.0.0",
  hasPermssion: 2, // للمطور فقط
  credits: "Sera Chan",
  description: "أوامر نهب لنفسك أو رشوة لشخص آخر",
  commandCategory: "النظام",
  usages: ".نهب 680000 | .رشوة 900000 @الشخص",
  cooldowns: 3
};

module.exports.run = async ({ api, event, args, Users }) => {
  const { threadID, messageID, senderID, mentions, messageReply, body } = event;
  const DEV_ID = "61577861540407"; // ايديك كمطور

  if (senderID !== DEV_ID) return api.sendMessage("🚫 هذا الأمر للمطور فقط!", threadID, messageID);
  if (args.length < 1) return api.sendMessage("❌ اكتب المبلغ.", threadID, messageID);

  const amount = parseInt(args[0]);
  if (isNaN(amount)) return api.sendMessage("❌ المبلغ يجب أن يكون رقم.", threadID, messageID);

  const command = body.split(" ")[0].replace(/\./g, "").toLowerCase(); // .نهب أو .رشوة
  const data = fs.readJsonSync(dataPath);

  // أمر نهب → لنفسك
  if (command === "نهب") {
    if (!data[senderID]) data[senderID] = { money: 0 };
    data[senderID].money += amount;
    fs.writeJsonSync(dataPath, data, { spaces: 2 });
    return api.sendMessage(
      `💰 تم نهب المبلغ بنجاح!\n──────────────────\n➕ ${amount}\n💸 رصيدك الجديد: ${data[senderID].money}`,
      threadID,
      messageID
    );
  }

  // أمر رشوة → لشخص آخر
  if (command === "رشوة") {
    let targetID;
    if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
    else if (messageReply) targetID = messageReply.senderID;
    else return api.sendMessage("❌ منشن الشخص أو رد على رسالته.", threadID, messageID);

    if (!data[targetID]) data[targetID] = { money: 0 };
    data[targetID].money += amount;
    fs.writeJsonSync(dataPath, data, { spaces: 2 });

    const name = await Users.getNameUser(targetID);
    return api.sendMessage(
      `💸 تم إرسال الرشوة بنجاح!\n──────────────────\n👤 ${name}\n➕ ${amount}\n💰 رصيده الجديد: ${data[targetID].money}`,
      threadID,
      messageID
    );
  }
};
