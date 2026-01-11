module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require("string-similarity");
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const logger = require("../../utils/log.js");
  const moment = require("moment-timezone");

  // ⏳ دالة التأخير العامة
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return async function ({ event }) {
    const dateNow = Date.now();
    const time = moment.tz("Asia/Manila").format("HH:mm:ss DD/MM/YYYY");
    const { allowInbox, PREFIX, ADMINBOT, DeveloperMode, adminOnly, YASSIN } = global.config;
    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;

    let { body, senderID, threadID, messageID } = event;
    senderID = String(senderID);
    threadID = String(threadID);

    const threadSetting = threadData.get(threadID) || {};
    const prefix = threadSetting.PREFIX || PREFIX;
    const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex(prefix)})\\s*`);
    const [matchedPrefix] = body.match(prefixRegex) || [null];
    const args = matchedPrefix
      ? body.slice(matchedPrefix.length).trim().split(/ +/)
      : body.trim().split(/ +/);

    const commandName = args.shift().toLowerCase();
    let command = commands.get(commandName);

    // ❌ تقييد الوضع التجريبي للمطورين فقط
    if (YASSIN === "true" && !ADMINBOT.includes(senderID)) return;

    // 🔍 البحث عن أقرب أمر إذا لم يوجد
    if (!command && matchedPrefix) {
      const allCommandNames = Array.from(commands.keys());
      const checker = stringSimilarity.findBestMatch(commandName, allCommandNames);
      if (checker.bestMatch.rating >= 0.8) {
        command = commands.get(checker.bestMatch.target);
      } else {
        return api.sendMessage(
          `الأمر "${commandName}" غير موجود.\nهل تقصد: "${checker.bestMatch.target}"؟`,
          threadID,
          messageID
        );
      }
    }

    // 🚫 التحقق من الحظر
    if ((userBanned.has(senderID) || threadBanned.has(threadID)) && !ADMINBOT.includes(senderID)) {
      if (userBanned.has(senderID)) {
        const { reason, dateAdded } = userBanned.get(senderID) || {};
        return api.sendMessage(
          `تم حظر حسابك.\nالسبب: ${reason || "غير محدد"}\nتاريخ الحظر: ${dateAdded || "غير معروف"}`,
          threadID,
          messageID
        );
      }
      if (threadBanned.has(threadID)) {
        const { reason, dateAdded } = threadBanned.get(threadID) || {};
        return api.sendMessage(
          `تم حظر هذه المجموعة.\nالسبب: ${reason || "غير محدد"}\nتاريخ الحظر: ${dateAdded || "غير معروف"}`,
          threadID,
          messageID
        );
      }
    }

    // 🚫 حظر الأوامر
    if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
      if (!ADMINBOT.includes(senderID)) {
        const banThreads = commandBanned.get(threadID) || [];
        const banUsers = commandBanned.get(senderID) || [];
        if (banThreads.includes(command?.config.name) || banUsers.includes(command?.config.name)) {
          return api.sendMessage(
            `هذا الأمر محظور في هذه المجموعة أو لحسابك.`,
            threadID,
            messageID
          );
        }
      }
    }

    // 🔞 أوامر NSFW
    if (
      command?.config.commandCategory.toLowerCase() === "nsfw" &&
      !global.data.threadAllowNSFW.includes(threadID) &&
      !ADMINBOT.includes(senderID)
    ) {
      return api.sendMessage(
        `هذه المجموعة لا تسمح باستخدام أوامر NSFW.`,
        threadID,
        messageID
      );
    }

    // 👮‍♂️ صلاحيات المستخدم
    let permissionLevel = 0;
    const threadInfoo = threadInfo.get(threadID) || await Threads.getInfo(threadID);
    if (ADMINBOT.includes(senderID)) permissionLevel = 2;
    else if (threadInfoo.adminIDs.some(e => e.id === senderID)) permissionLevel = 1;

    if (command?.config.hasPermssion > permissionLevel) {
      return api.sendMessage(
        `ليس لديك الصلاحية لتنفيذ هذا الأمر.`,
        threadID,
        messageID
      );
    }

    // ⏱️ نظام التبريد
    if (!cooldowns.has(command?.config.name)) cooldowns.set(command?.config.name, new Map());
    const timestamps = cooldowns.get(command?.config.name);
    const expirationTime = (command?.config.cooldowns || 1) * 1000;
    if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime) {
      return api.setMessageReaction("⏳", messageID, () => {}, true);
    }

    // 🌐 دعم اللغات
    let getText = () => "";
    if (command?.languages && command.languages[global.config.language]) {
      getText = (...values) => {
        let lang = command.languages[global.config.language][values[0]] || "";
        for (let i = values.length - 1; i > 0; i--) {
          lang = lang.replace(new RegExp("%" + i, "g"), values[i]);
        }
        return lang;
      };
    }

    try {
      const context = {
        api,
        event,
        args,
        models,
        Users,
        Threads,
        Currencies,
        permissionLevel,
        getText
      };

      // ⏳ تأخير اختياري (يمكن إزالته إذا غير مطلوب)
      await delay(1000);

      // تنفيذ الأمر
      command?.run(context);

      // تحديث التوقيت الأخير للتبريد
      timestamps.set(senderID, dateNow);

      // تسجيل الأداء في وضع المطور
      if (DeveloperMode && command) {
        logger(`[DEV] ${commandName} | User: ${senderID} | Thread: ${threadID} | ${Date.now() - dateNow}
