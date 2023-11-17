import ngrok from 'ngrok';
import express from 'express';
import { Bot, webhookCallback } from 'grammy';

import { initDB } from './db';
import { MyContext, mySession } from './bot/session';
import { getTitlesByName } from './api/anilist';
import { searchedReleasesMenu, searchedResolutionsMenu, searchResultsMenu } from './bot/menu';


const TOKEN = process.env.TOKEN;
const bot = new Bot<MyContext>(TOKEN ?? '');
searchResultsMenu.register(searchedReleasesMenu);
searchedReleasesMenu.register(searchedResolutionsMenu);
bot.use(mySession, searchResultsMenu);

bot.on('message', async ctx => {
  if (ctx.message.text === '/start') {
    return ctx.reply("Let's search for ongoing anime together!")
  }

  const title = ctx.message.text!;
  ctx.session.searchedAnimes = await getTitlesByName(title);

  await ctx.reply('Search results:', {reply_markup: searchResultsMenu});
});

const server = express();
server.use(express.json());
server.post('/bot-webhook', webhookCallback(bot, 'express'));
// @ts-ignore
server.post('/bot-webhook', (error, req, res, next) => {
  console.log("Error Handling Middleware called")
  console.log('Path: ', req.path)
  next() // (optional) invoking next middleware
});

async function setup() {
  if (process.env.NODE_ENV === 'production') {
    await bot.api.setWebhook(process.env.HOST ?? '');
  } else {
    const host = await ngrok.connect(Number(process.env.PORT));
    console.log('ngrok connected on', host);
    await bot.api.setWebhook(host + '/bot-webhook');
  }
  server.listen(process.env.PORT);

  await initDB();
}

setup().then(() => console.log('Up and running!'));
