const dotenv = require('dotenv');
const express = require('express');
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const mongoose = require('mongoose');

// const mongooseConnect = require('./misc/db');
const geocode = require('./locationiq');
const weather = require('./wheather');
const User = require('./models/userModel');

dotenv.config();
mongoose.connect(process.env.DATABASE_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const app = express();

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('index')
});

let getThemAll;

app.get('/get', async (req, res) => {
  getThemAll = await User.find();
  console.log(getThemAll);
res.send(getThemAll)
})


const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(async (ctx) => {
  const userName = ctx.message.from.first_name;
  const last_name = ctx.message.from.last_name;
  const id = ctx.message.from.id;
  const username = ctx.message.from.username;
  // console.log(ctx.message.from);
  let user;
  try {
    user = await User.findOne({ userFirstName: userName })
    // console.log(user);
  } catch (error) {
  }
  if (!user) {
    // console.log('we got new user!');
    const newUser = await new User({
      userFirstName: userName,
      userLastName: last_name,
      userId: id,
      userUserName: username,
    });
    newUser.save();
  }
  ctx.reply(
    `Добро пожаловать ${userName}!
    Здесь ты можешь узнать погоду.
    Введи адрес.`,
    Markup.keyboard([
      ['/start', '/help'],
      ['👍']
    ])
      .resize()
      .extra()
  )
}
);

bot.help((ctx) => ctx.reply('👍'));
bot.on('text', (ctx) => {
  const address = ctx.message.text;
  let addressFound = '';

  geocode.geocodeAddress(address)
    .then(response => {
      addressFound = response.address

      return weather.getWeather(response.latitude, response.longitude)
    })
    .then(response => {
      let message = `
      Ваш адрес: ${addressFound}
      Температура: ${response.temperature}
      В ближайшем будущем температура будет: ${response.apparentTemperature}
      `;
      return ctx.reply(message)
    })
    .catch(error => {
      console.log(error);
    })
});

bot.launch();
console.log("Бот запущен");

app.listen(3000, console.log('Порт запущен'))
