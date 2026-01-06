module.exports.config = {
  name: "خلفية",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "عمر",
  description: "خلفيات أنمي مذهلة بأسلوب سيرا 🐱😺",
  commandCategory: "صور",
  usages: "صور انمي 4k ب 200$",
  cooldowns: 5,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.run = async({api,event,args,Currencies}) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  const link = [
    "https://i.imgur.com/2R0f20J.jpg",
    "https://i.imgur.com/mEdIJnB.jpg",
    "https://i.imgur.com/OFuOHXq.jpg",
    "https://i.imgur.com/bbRQY5P.jpg",
    "https://i.imgur.com/pPRJWsr.jpg",
    "https://i.imgur.com/yIeo9ou.jpg",
    "https://i.imgur.com/egpjvuT.jpg",
    "https://i.imgur.com/Fn3DfOQ.jpg",
    "https://i.imgur.com/r5J7D1F.jpg",
    "https://i.imgur.com/M6PQkAX.jpg",
    "https://i.imgur.com/nr8cAjF.jpg",
    "https://i.imgur.com/xHXRAM4.jpg",
    "https://i.imgur.com/ufCpqcg.jpg",
    "https://i.imgur.com/47ugEAm.jpg",
    "https://i.imgur.com/v2pU3Tj.jpg",
    "https://i.imgur.com/SLJeyO7.jpg",
    "https://i.imgur.com/FDLf4PD.jpg",
    "https://i.imgur.com/E4Izv3W.jpg",
    "https://i.imgur.com/gmtqHam.jpg",
    "https://i.imgur.com/0iM9AZr.jpg",
    "https://i.imgur.com/hqdrxWu.jpg",
    "https://i.imgur.com/TZ99Hrf.jpg",
  ];

  const data = await Currencies.getData(event.senderID);
  const money = data.money;

  if(money < 200) {
    return api.sendMessage(`😿 أوه لا! تحتاج إلى 200 دولار فقط لنسرق منك ونمنحك خلفية أنمي رائعة 🐱💖\nتجمع شوية فلوس بسرعة! 💸`, event.threadID, event.messageID);
  } else {
    Currencies.setData(event.senderID, {money: money - 200});
    const randomLink = link[Math.floor(Math.random() * link.length)];
    const max = Math.floor(Math.random() * 6);  
    const min = Math.floor(Math.random() * 2);

    const callback = () => {
      api.sendMessage({
        body: `✨ تفضل يا بطل! خلفية أنمي جديدة لك 🐱😺\nنصيحة من سيرا: خليها خلفية شاشة حاسوبك عشان تصبح أكثر روعة! 💫`,
        attachment: fs.createReadStream(__dirname + "/cache/1.jpg")
      }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"), event.messageID);
    };

    return request(encodeURI(randomLink + (max - min)))
      .pipe(fs.createWriteStream(__dirname+"/cache/1.jpg"))
      .on("close", () => callback());
  }
};
