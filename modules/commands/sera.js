module.exports.config = {
  name: "سيرا",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "تحكم بشخصية سيرا",
  commandCategory: "system",
  usages: ".سيرا",
  cooldowns: 0
};

if (!global.SERA) {
  global.SERA = {
    MODE: "NORMAL",
    OWNER: "61577861540407"
  };
}

module.exports.run = async function({ api, event }) {
  const { senderID, threadID, body } = event;

  if (senderID !== global.SERA.OWNER)
    return api.sendMessage("⛔ هذا الأمر ليس لك.", threadID);

  if (body.includes("ابنة ابليس")) {
    global.SERA.MODE = "DEVIL";
    return api.sendMessage(
      "🩸 تم تفعيل وضع ابنة إبليس.\n👁️ سيرا تشان تراقب الجميع.",
      threadID
    );
  }

  if (body.includes("ابنة ايمن")) {
    global.SERA.MODE = "NORMAL";
    return api.sendMessage(
      "🩷 عادت سيرا تشان.\n😼 تحبك… والبقية؟ نتسلى عليهم.",
      threadID
    );
  }

  api.sendMessage(
    "اكتب:\n.سيرا ابنة ابليس\nأو\n.سيرا ابنة ايمن",
    threadID
  );
};
