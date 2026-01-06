module.exports.config = {
  name: "زخرفة",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Ayman 61577861540407",
  description: "✨ يزخرف النص العربي بشكل احترافي مع رموز وزخارف",
  commandCategory: "خدمات",
  usages: "زخرفة [النص]",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const text = args.join(" ");

  if (!text) return api.sendMessage("الرجاء إدخال نص لزخرفته.", threadID, messageID);

  const arabicLetters = {
      ا: ["ٱ","آ","ا","اٰ","۝","﴾ا﴿"],
      ب: ["بّ","بـ","ب","بٰ","۞","ب♡"],
      ت: ["تُ","ت","تّ","تٰ","✧ت✧","ت★"],
      ث: ["ثً","ث","ثّ","ثٰ","ث✿","✧ث"],
      ج: ["جَ","ج","جّ","جٰ","ج☆","✿ج"],
      ح: ["حً","ح","حّ","حٰ","✦ح","ح❀"],
      خ: ["خٌ","خ","خّ","خٰ","✧خ","خ★"],
      د: ["دِ","د","دّ","د✿","د✧"],
      ذ: ["ذٌ","ذ","ذّ","✿ذ","✧ذ"],
      ر: ["ر","رّ","رٰ","✦ر","ر✿"],
      ز: ["ز","زّ","زٰ","✧ز","ز★"],
      س: ["سً","س","سّ","سٰ","✿س","س✧"],
      ش: ["شّ","ش","شٰ","✦ش","ش✿"],
      ص: ["صِ","ص","صّ","صٰ","✧ص","ص★"],
      ض: ["ض","ضّ","ضٰ","✿ض","ض✧"],
      ط: ["طٌ","ط","طّ","طٰ","✦ط","ط✿"],
      ظ: ["ظٌ","ظ","ظّ","ظٰ","✧ظ","ظ★"],
      ع: ["عَ","ع","عّ","عٰ","✿ع","ع✧"],
      غ: ["غّ","غ","غٰ","✦غ","غ✿"],
      ف: ["فُ","ف","فّ","فٰ","✧ف","ف★"],
      ق: ["قَ","ق","قّ","قٰ","✿ق","ق✧"],
      ك: ["ك","كّ","كٰ","✦ك","ك✿"],
      ل: ["لَ","ل","لّ","لٰ","✧ل","ل★"],
      م: ["مِ","م","مّ","مٰ","✿م","م✧"],
      ن: ["نٌ","ن","نّ","نٰ","✦ن","ن✿"],
      ه: ["ه","هّ","هٰ","هے","✧ه","ه★"],
      و: ["و","وّ","وٰ","وُ","✿و","و✧"],
      ي: ["يّ","ي","يٰ","يُ","✦ي","ي✿"],
      ى: ["يّ","ى","ي","يٰ","✧ى","ى★"]
  };

  const symbols = ["✦","✧","★","✿","♡","۞","✩","☽","☾","✵","❀","❁"];

  let msgText = "";

  for (const letter of text) {
      if (arabicLetters[letter]) {
          const options = arabicLetters[letter];
          // اختر حرف مع زخارف + رمز عشوائي
          const randomLetter = options[Math.floor(Math.random() * options.length)];
          const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
          msgText += `${randomSymbol}${randomLetter}${randomSymbol}`;
      } else {
          const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
          msgText += `${randomSymbol}${letter}${randomSymbol}`;
      }
  }

  return api.sendMessage(`✨ هنا النص المزخرف بطريقة فنية:\n\n${msgText}`, threadID, messageID);
};
