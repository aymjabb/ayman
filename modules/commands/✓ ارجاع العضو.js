const fs = require("fs-extra");

module.exports.config = {
  name: "ارجاع",
  version: "2.2.0",
  hasPermssion: 1, 
  credits: "Sera Chan",
  description: "ترجع العضو عن طريق الآيدي أو المنشن ✨",
  commandCategory: "الادارة",
  usages: "[الآيدي] أو [@منشن]",
  cooldowns: 5
};

const path = __dirname + "/cache/leaveCount.json";

module.exports.run = async function({ api, event, args, Users }) {
  const { threadID, messageID, mentions } = event;

  if (!fs.existsSync(path)) fs.writeJsonSync(path, {});
  let leaveData = fs.readJsonSync(path);

  let targetIDs = [];

  // 1. التحقق من وجود منشن
  if (Object.keys(mentions).length > 0) {
    targetIDs = Object.keys(mentions);
  } 
  // 2. التحقق من وجود آيدي في المدخلات (args)
  else if (args.length > 0) {
    targetIDs = args.filter(id => !isNaN(id));
  }

  if (targetIDs.length === 0) {
    return api.sendMessage("╭──── • ◈ • ────╮\n  يوه! حط آيدي الشخص أو سوي له منشن ✨\n╰──── • ◈ • ────╯", threadID, messageID);
  }

  for (let userID of targetIDs) {
    if (!leaveData[threadID]) leaveData[threadID] = {};
    if (!leaveData[threadID][userID]) leaveData[threadID][userID] = 0;

    // التحقق من سجل الخروج
    if (leaveData[threadID][userID] >= 2) {
      api.sendMessage(`🥺 يا عسل، الشخص هذا 【 ${userID} 】 خرج كثير.. سيرا ما تقدر ترجعه!`, threadID, messageID);
      continue;
    }

    try {
      await api.addUserToGroup(userID, threadID);
      leaveData[threadID][userID]++;
      fs.writeJsonSync(path, leaveData);

      const name = await Users.getNameUser(userID) || "العضو";
      api.sendMessage(
        `✨ تدااااا! رجعت لك الحبيب ✨\n\n🐾 【 ${name} 】 نورتنا من جديد يا سكرة، لا تطلع مرة ثانية وتزعل سيرا! 🎀`,
        threadID
      );
    } catch (e) {
      api.sendMessage(`❌ سيرا حاولت ترجع الحساب 【 ${userID} 】 بس ما قدرت! يمكن طاردني أو حسابه مقفل 🥺`, threadID, messageID);
    }
  }
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, logMessageType, logMessageData } = event;

  if (logMessageType === "log:unsubscribe") {
    if (!fs.existsSync(path)) fs.writeJsonSync(path, {});
    let leaveData = fs.readJsonSync(path);

    const leftID = logMessageData.leftParticipantFbId;
    if (!leaveData[threadID]) leaveData[threadID] = {};
    if (!leaveData[threadID][leftID]) leaveData[threadID][leftID] = 0;
    
    fs.writeJsonSync(path, leaveData);
  }
};
