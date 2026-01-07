module.exports.config = {
  name: "smartCommands",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "نقاط، لقب تلقائي، تصفير",
  commandCategory: "النظام",
  usages: "-نقاط / -لقب / -تصفير",
  cooldowns: 2
};

const fs = require("fs-extra");
const SMART = require("../sera/smartSystem");

module.exports.handleEvent = async function({ api, event }) {
  const { body, threadID, senderID } = event;
  if (!body) return;
  if (!SMART.isEnabled()) return;

  const users = fs.readJsonSync("./sera/users.json");

  if (body.startsWith("-نقاط")) {
    const user = users[senderID];
    user.points = (user.points || 0) + 100;
    fs.writeJsonSync("./sera/users.json", users, { spaces: 2 });
    return api.sendMessage(`✅ تم إضافة 100 نقطة لك ${senderID}`, threadID);
  }

  if (body.startsWith("-لقب")) {
    const user = users[senderID];
    user.title = `عضو مميز 🌟`;
    fs.writeJsonSync("./sera/users.json", users, { spaces: 2 });
    return api.sendMessage(`🏅 تم إعطاء لقب جديد لك ${senderID}`, threadID);
  }

  if (body.startsWith("-تصفير")) {
    const user = users[senderID];
    user.points = 0;
    user.money = 0;
    fs.writeJsonSync("./sera/users.json", users, { spaces: 2 });
    return api.sendMessage(`🧹 تم تصفير نقاطك وعملاتك`, threadID);
  }
};
