import { Menu, MenuRange } from "@grammyjs/menu";

import { Bot, Context, session, SessionFlavor } from "grammy";

import { Anime, getAnimeByName } from './api/getTitleByName';

const TOKEN = process.env.TOKEN;

interface SessionData {
  searchedAnimes: Anime[];
  menuMessageId: number;
}

type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(TOKEN ?? '');
bot.use(session({
  initial: () => {
    const searchedAnimes = [] as Anime[];

    return {
      searchedAnimes,
      menuMessageId: 0,
    }
  }
}));

const searchResultsMenu = new Menu<MyContext>('searchResultsMenu');
searchResultsMenu
  .dynamic(async (ctx) => {
    const range = new MenuRange<MyContext>();
    ctx.session.searchedAnimes.forEach(anime => {
      range
        .text(`${anime.title.romaji} / ${anime.title.native}`, (ctx) => ctx.reply(anime.id.toString()))
        .row();
    });

    return range;
  });
bot.use(searchResultsMenu);

bot.on('message', async ctx => {
  if (ctx.message.text === '/start') {
    return ctx.reply("Let's search for ongoing anime!")
  }
  await ctx.deleteMessage();

  const title = ctx.message.text!;
  ctx.session.searchedAnimes = await getAnimeByName(title);

  if (ctx.session.menuMessageId) {
    await ctx.api.editMessageReplyMarkup(ctx.chat.id, ctx.session.menuMessageId, {reply_markup: searchResultsMenu}).catch();
  } else {
    const response = await ctx.reply('Search results:', {reply_markup: searchResultsMenu});
    ctx.session.menuMessageId = response.message_id;
  }
});

bot.start({
  onStart: () => console.log('Up and running!')
}).catch(e => console.log(e))
