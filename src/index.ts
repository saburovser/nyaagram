import ngrok from 'ngrok';
import express from 'express';
import { Bot, webhookCallback } from 'grammy';

import { MyContext, mySession } from './bot/session';
import { getTitlesByName } from './api/anilist/getTitleByName';
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
  await ctx.deleteMessage();

  const title = ctx.message.text!;
  ctx.session.searchedAnimes = await getTitlesByName(title);

  if (ctx.session.menuMessageId) {
    await ctx.api.editMessageReplyMarkup(ctx.chat.id, ctx.session.menuMessageId, {reply_markup: searchResultsMenu}).catch();
  } else {
    const response = await ctx.reply('Search results:', {reply_markup: searchResultsMenu});
    ctx.session.menuMessageId = response.message_id;
  }
});

bot.catch((e) => {
  return e.ctx.reply(['```', JSON.stringify(e, undefined,' '), '```'].join('\n'), { parse_mode: 'MarkdownV2' });
});

const server = express();
server.use(express.json());
server.post('/bot-webhook', webhookCallback(bot, 'express'), e => console.log(e));

async function setup() {
  if (process.env.NODE_ENV === 'development') {
    const host = await ngrok.connect(Number(process.env.PORT));
    console.log('ngrok connected on', host);
    await bot.api.setWebhook(host + '/bot-webhook');
  } else {
    await bot.api.setWebhook(process.env.HOST ?? '');
  }
  server.listen(process.env.PORT);
}

setup().then(() => console.log('Up and running!'))
