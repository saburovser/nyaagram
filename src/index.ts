import { Bot } from 'grammy';

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
    return ctx.reply("Let's search for ongoing anime!")
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

bot.start({
  onStart: () => console.log('Up and running!')
}).catch(e => console.log(e));
