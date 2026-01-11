module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");

    return function ({ event }) {
        const { allowInbox } = global.config;
        const { userBanned, threadBanned } = global.data;
        const { commands, eventRegistered } = global.client;

        let senderID = String(event.senderID);
        let threadID = String(event.threadID);

        // ❌ التحقق من الحظر والبريد الشخصي
        if (userBanned.has(senderID) || threadBanned.has(threadID) || (allowInbox && senderID === threadID)) return;

        // 🌟 معالجة كل حدث مسجّل
        for (const eventReg of eventRegistered) {
            const cmd = commands.get(eventReg);

            // ✨ نظام اللغات مع زخرفة ASCII
            let getText;
            if (cmd.languages && typeof cmd.languages === "object") {
                getText = (...values) => {
                    const langPack = cmd.languages || {};
                    if (!langPack.hasOwnProperty(global.config.language)) {
                        return api.sendMessage(
                            `⚠️ لغة الأمر "${cmd.config.name}" غير موجودة!`,
                            threadID,
                            event.messageID
                        );
                    }
                    let lang = langPack[global.config.language][values[0]] || '';
                    for (let i = values.length - 1; i > 0; i--) {
                        const expReg = RegExp('%' + i, 'g');
                        lang = lang.replace(expReg, values[i]);
                    }

                    // 🎨 زخرفة ASCII بسيطة
                    return `╔═══╦═ ✦ ✧ ✦ ═╗\n║ ${lang} ║\n╚═══╩═ ✦ ✧ ✦ ═╝`;
                };
            } else getText = () => {};

            try {
                const context = {
                    event,
                    api,
                    models,
                    Users,
                    Threads,
                    Currencies,
                    getText
                };

                // 🚀 تنفيذ الحدث
                if (cmd) cmd.handleEvent(context);

            } catch (error) {
                logger(
                    `💥 خطأ في تنفيذ حدث الأمر "${cmd.config.name}" :\n${error.message}`,
                    "error"
                );
            }
        }
    };
};
