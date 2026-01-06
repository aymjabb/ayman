module.exports.config = {
  name: "طقس",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "61577861540407 • مزخرف بواسطة Sera Chan 🐱",
  description: "عرض معلومات الطقس حسب موقعك مع طابع سيرا تشان",
  commandCategory: "خدمات",
  usages: "[موقعك]",
  cooldowns: 5,
  dependencies: {
    "moment-timezone": "",
    "request": ""
  },
  envConfig: {
    "OPEN_WEATHER": "c4ef85b93982d6627681b056e24bd438"
  }
};

module.exports.languages = {
  "en": {
    "locationNotExist": "⚠️ لم أتمكن من العثور على: %1 🐾",
    "returnResult": "🌤 سيرا تشان تقول: إليك حالة الطقس في %1!\n\n🌡 درجة الحرارة: %2℃\n🌡 يشعر وكأنها: %3℃\n☁️ السماء: %4\n💦 الرطوبة: %5%\n💨 سرعة الرياح: %6km/h\n🌅 شروق الشمس: %7\n🌄 غروب الشمس: %8\n🐱 تذكر، الطقس اليوم مع سيرا تشان أكثر مرحًا!"
  },
  "ar": {
    "locationNotExist": "⚠️ لم أتمكن من العثور على المكان: %1 🐾",
    "returnResult": "🌤 سيرا تشان تقول: إليك حالة الطقس في %1!\n\n🌡 درجة الحرارة: %2℃\n🌡 يشعر وكأنها: %3℃\n☁️ السماء: %4\n💦 الرطوبة: %5%\n💨 سرعة الرياح: %6km/h\n🌅 شروق الشمس: %7\n🌄 غروب الشمس: %8\n🐱 تذكر، الطقس اليوم مع سيرا تشان أكثر مرحًا!"
  }
};

module.exports.run = async ({ api, event, args, getText }) => {
  const request = global.nodemodule["request"];
  const moment = global.nodemodule["moment-timezone"];
  const { throwError } = global.utils;
  const { threadID, messageID } = event;

  var city = args.join(" ");
  if (city.length == 0) return throwError(this.config.name, threadID, messageID);

  return request(encodeURI(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${global.configModule[this.config.name].OPEN_WEATHER}&units=metric&lang=${global.config.language}`), (err, response, body) => {
    if (err) throw err;

    var weatherData = JSON.parse(body);
    if (weatherData.cod !== 200) 
      return api.sendMessage(getText("locationNotExist", city), threadID, messageID);

    var sunrise_date = moment.unix(weatherData.sys.sunrise).tz("Asia/Baghdad");
    var sunset_date = moment.unix(weatherData.sys.sunset).tz("Asia/Baghdad");

    api.sendMessage({
      body: getText("returnResult", city, weatherData.main.temp, weatherData.main.feels_like, weatherData.weather[0].description, weatherData.main.humidity, weatherData.wind.speed, sunrise_date.format('HH:mm:ss'), sunset_date.format('HH:mm:ss')),
      location: {
        latitude: weatherData.coord.lat,
        longitude: weatherData.coord.lon,
        current: true
      },
    }, threadID, messageID);
  });
};
