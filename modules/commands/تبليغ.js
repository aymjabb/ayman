module.exports.config = {
  name: "تبليغ",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Sera Chan",
  description: "إرسال تبليغ هام للمجموعة مع منشن للكل",
  commandCategory: "إدارة",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const content = args.join(" ");
  if (!content) return api.sendMessage("📩 أكتب التبليغ الذي تريد إرساله.", threadID, messageID);

  const threadInfo = await api.getThreadInfo(threadID);
  const ids = threadInfo.participantIDs;
  
  let msg = `📣 تـبـلـيـغ إداري هـام:\n──────────────────\n${content}\n──────────────────\n`;
  let mentions = [];

  for (let id of ids) {
    mentions.push({ tag: "@تبليغ", id: id });
  }

  return api.sendMessage({ body: msg, mentions }, threadID);
};
