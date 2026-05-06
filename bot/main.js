import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';

const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL;

const bot = new Telegraf(token);

bot.command('start', (ctx) => {
    ctx.reply('Welcome to the bot! Please click the button to proceed:',
        Markup.keyboard([
            Markup.button.webApp('Send Message', webAppUrl)
        ]));
});

bot.launch();