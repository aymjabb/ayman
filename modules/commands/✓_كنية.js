module.exports.config = {
  name: "كنية_",
  version: "3.0.0",
  hasPermssion: 2,
  credits: "ZINO - تطوير منتصر",
  description: "تغيير كنية لأي عضو بالمنشن أو الرد، أو لجميع الأعضاء مع إمكانية الإيقاف والمتابعة 🐱",
  commandCategory: "خدمات",
  usages: ".كنية_ [الكنية] | .كنية_ @منشن | .كنية_ ايقاف | .كنية_ حالة",
  cooldowns: 5
};

global.nicknameProcesses = global.nicknameProcesses || new Map();

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID, messageReply, mentions } = event;

  // إيقاف العملية
  if (args[0]?.toLowerCase() === "ايقاف" || args[0]?.toLowerCase() === "stop") {
    if (!global.nicknameProcesses.has(threadID)) 
      return api.sendMessage("❌ | لا توجد عملية تغيير كنيات جارية", threadID, messageID);
    global.nicknameProcesses.get(threadID).stop = true;
    return api.sendMessage("⏹️ | تم إيقاف عملية تغيير الكنيات", threadID, messageID);
  }

  // حالة العملية
  if (args[0]?.toLowerCase() === "حالة" || args[0]?.toLowerCase() === "status") {
    if (!global.nicknameProcesses.has(threadID)) 
      return api.sendMessage("❌ | لا توجد عملية تغيير كنيات جارية", threadID, messageID);
    const process = global.nicknameProcesses.get(threadID);
    return api.sendMessage(
      `📊 | حالة تغيير الكنيات:\n` +
      `• تم تغيير: ${process.completed} عضو\n` +
      `• المتبقي: ${process.remaining} عضو\n` +
      `• الكنية الحالية: "${process.nickname}"`,
      threadID, messageID
    );
  }

  // تحديد المستخدم المستهدف
  let targetID;
  if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0]; // منشن
  else if (messageReply) targetID = messageReply.senderID; // رد
  else targetID = null; // لتغيير جميع الأعضاء

  // إذا لم يُدخل كنية، اطلب منه
  if (!args.join("") && !targetID) {
    return api.sendMessage(
      "💬 | قم بالرد على هذه الرسالة أو استخدم المنشن لتغيير كنية شخص معين.\n" +
      "📝 | أو استخدم: \n• .كنية_ ايقاف - لإيقاف العملية\n• .كنية_ حالة - لمعرفة تقدم العملية",
      threadID,
      (err, info) => {
        if (err) return;
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID
        });
      },
      messageID
    );
  }

  // الكنية الجديدة
  const newNickname = args.join(" ") + " 🐱"; // إضافة إيموجي القط تلقائي

  if (targetID) {
    // تغيير كنية شخص محدد
    try {
      await api.changeNickname(newNickname, threadID, targetID);
      return api.sendMessage(`✅ | تم تغيير كنية الشخص إلى: "${newNickname}"`, threadID, messageID);
    } catch {
      return api.sendMessage("❌ | حدث خطأ أثناء تغيير الكنية للشخص المحدد", threadID, messageID);
    }
  } else {
    // تغيير كنية لجميع الأعضاء
    changeAllNicknames(api, threadID, senderID, newNickname, messageID);
  }
};

// دعم الرد على الرسالة لتحديد الكنية
module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, senderID, messageID, body } = event;
  if (handleReply.author != senderID) return;

  const newNickname = body.trim() + " 🐱";
  changeAllNicknames(api, threadID, senderID, newNickname, messageID);
};

// الدالة الأساسية لتغيير الكنيات لجميع الأعضاء
async function changeAllNicknames(api, threadID, senderID, nickname, messageID) {
  const threadInfo = await api.getThreadInfo(threadID);
  const participants = threadInfo.participantIDs;

  global.nicknameProcesses.set(threadID, {
    stop: false,
    completed: 0,
    remaining: participants.length,
    nickname,
    total: participants.length
  });

  api.sendMessage(
    `⏳ | جاري تغيير كنية جميع الأعضاء...\n📝 | الكنية الجديدة: "${nickname}"\n👥 | العدد الكلي: ${participants.length} عضو\n\n💡 | استخدم ".كنية_ ايقاف" لإيقاف العملية`,
    threadID, messageID
  );

  let success = 0, failed = 0;

  for (let i = 0; i < participants.length; i++) {
    const userID = participants[i];
    const process = global.nicknameProcesses.get(threadID);

    if (process && process.stop) {
      api.sendMessage(
        `⏹️ | تم إيقاف العملية!\n✅ | تم تغيير: ${success} عضو\n❌ | فشل: ${failed} عضو\n⏸️ | المتبقي: ${participants.length - i} عضو`,
        threadID, messageID
      );
      global.nicknameProcesses.delete(threadID);
      return;
    }

    try {
      await api.changeNickname(nickname, threadID, userID);
      success++;
    } catch {
      failed++;
    }

    if (process) {
      process.completed = success + failed;
      process.remaining = participants.length - (success + failed);
    }

    if ((success + failed) % 10 === 0 && (success + failed) < participants.length) {
      api.sendMessage(`📊 | تقدم العملية: ${success + failed}/${participants.length}\n✅ | نجح: ${success} | ❌ فشل: ${failed}`, threadID);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  global.nicknameProcesses.delete(threadID);

  api.sendMessage(
    `✅ | تم تغيير الكنية لجميع الأعضاء بنجاح!\n👥 | تم تغيير: ${success} عضو\n❌ | فشل: ${failed} عضو\n📝 | الكنية الجديدة: "${nickname}"`,
    threadID, messageID
  );
}
