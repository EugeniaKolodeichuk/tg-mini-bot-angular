import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';

const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL;

const bot = new Telegraf(token);

bot.command('start', (ctx) => {
    ctx.reply('Welcome to the bot! Please click the button to proceed:',
        Markup.keyboard([
            Markup.button.webApp('Send Message', `${webAppUrl}feedback`)
        ]));
});

bot.on(message('web_app_data'), async ctx => {
    const data = ctx.webAppData.data.json();
    ctx.reply(`Received your feedback: ${data?.feedback || 'No feedback provided'}`);
});

bot.launch();