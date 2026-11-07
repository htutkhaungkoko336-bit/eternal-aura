const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAH_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN);
const GROUP_ID = process.env.ETERNAL_AURA_CLIENT_GP_ID;

const userSessions = {};

// Group ထဲမှာရော PM မှာပါ /start ရိုက်ရင် Bot PM ဆီ လမ်းကြောင်းပေးရန်
bot.command('start', async (ctx) => {
  const botInfo = await bot.telegram.getMe();
  const botUsername = botInfo.username;
  
  if (ctx.chat.type !== 'private') {
    // Group ထဲမှာဆိုရင် PM ထဲသွားဖို့ ခလုတ်ပြမယ် (Group ထဲမှာ စာမရှုပ်အောင်)
    return ctx.reply('🤖 လူခေါ်ဆိုမှု Card ပြုလုပ်ရန် Bot ထံသို့ သွားရောက်ပါ:', Markup.inlineKeyboard([
      [Markup.button.url('✨ Bot ထံသို့ သွားရန် (Start)', `https://t.me/${botUsername}?start=recrut`)]
    ]));
  }

  // Bot PM ထဲရောက်ပြီဆိုရင် Fee ရွေးခိုင်းမယ်
  const userId = ctx.from.id;
  userSessions[userId] = { fee: '', roles: [] };

  await ctx.reply('💰 ကျေးဇူးပြု၍ ကြေးပွဲပမာဏ (Fee) ကို ရွေးချယ်ပါ:', Markup.inlineKeyboard([
    [Markup.button.callback('5k MMK', 'fee_5K'), Markup.button.callback('10k MMK', 'fee_10K')],
    [Markup.button.callback('15k MMK', 'fee_15K'), Markup.button.callback('25k MMK', 'fee_25K')],
    [Markup.button.callback('50k MMK', 'fee_50K')]
  ]));
});

// Telegram Bot Menu (`/start` Command) သတ်မှတ်ပေးရန်
bot.telegram.setMyCommands([
  { command: 'start', description: 'Eternal Aura Matchmaking စတင်ရန်' }
]);

// Fee ရွေးပြီးရင် Role ဆက်ရွေးခိုင်းခြင်း
bot.action(/^fee_(.+)$/, async (ctx) => {
  const userId = ctx.from.id;
  const fee = ctx.match[1];

  if (!userSessions[userId]) userSessions[userId] = { roles: [] };
  userSessions[userId].fee = fee;

  await ctx.answerCbQuery();
  await ctx.editMessageText(`💰 ရွေးချယ်ထားသော Fee: ${fee}\n\n🎯 လိုအပ်သော Role များကို ရွေးချယ်ပါ (ပြီးလျှင် "✅ ပြီးဆုံးပါပြီ (Done)" ကို နှိပ်ပါ):`, Markup.inlineKeyboard([
    [Markup.button.callback('⚔️ Gold Lane', 'role_GOLD'), Markup.button.callback('🛡️ Roam', 'role_ROAM')],
    [Markup.button.callback('🌴 Jungler', 'role_JG'), Markup.button.callback('🧙‍♂️ Mid Lane', 'role_MID')],
    [Markup.button.callback('🗡️ EXP Lane', 'role_EXP'), Markup.button.callback('🔥 Any Role', 'role_ANY')],
    [Markup.button.callback('✅ ပြီးဆုံးပါပြီ (Done)', 'done_recruitment')]
  ]));
});

// Role များကို ထည့်/ဖြုတ် လုပ်ခြင်း
bot.action(/^role_(.+)$/, async (ctx) => {
  const userId = ctx.from.id;
  const role = ctx.match[1];

  if (!userSessions[userId]) userSessions[userId] = { roles: [] };
  
  const roles = userSessions[userId].roles;
  const index = roles.indexOf(role);

  if (index > -1) {
    roles.splice(index, 1);
  } else {
    roles.push(role);
  }

  const currentFee = userSessions[userId].fee;
  const selectedRolesText = roles.length > 0 ? roles.join(', ') : 'မရွေးရသေးပါ';

  await ctx.answerCbQuery(`Role: ${role}`);
  await ctx.editMessageText(`💰 Fee: ${currentFee}\n🎯 ရွေးထားသော Roles: ${selectedRolesText}\n\nဆက်လက်ရွေးချယ်ပါ သို့မဟုတ် ပြီးလျှင် Done နှိပ်ပါ:`, Markup.inlineKeyboard([
    [Markup.button.callback('⚔️ Gold Lane', 'role_GOLD'), Markup.button.callback('🛡️ Roam', 'role_ROAM')],
    [Markup.button.callback('🌴 Jungler', 'role_JG'), Markup.button.callback('🧙‍♂️ Mid Lane', 'role_MID')],
    [Markup.button.callback('🗡️ EXP Lane', 'role_EXP'), Markup.button.callback('🔥 Any Role', 'role_ANY')],
    [Markup.button.callback('✅ ပြီးဆုံးပါပြီ (Done)', 'done_recruitment')]
  ]));
});

// Done နှိပ်လိုက်တာနဲ့ Group ထဲ Card ပို့ပေးမည့် အပိုင်း
bot.action('done_recruitment', async (ctx) => {
  const userId = ctx.from.id;
  const data = userSessions[userId];

  if (!data || !data.fee || data.roles.length === 0) {
    return ctx.answerCbQuery('ကျေးဇူးပြု၍ Fee နှင့် Role တစ်ခုခုကို အရင်ရွေးချယ်ပါ။', { show_alert: true });
  }

  // Username ရှိရင် @username ပြမည်၊ မရှိရင် First Name (သို့) Host ပြမည်
  const hostName = ctx.from.username 
    ? `@${ctx.from.username}` 
    : (ctx.from.first_name || 'Host');

  const fee = data.fee;
  const rolesList = data.roles.join(', ');

  try {
    // Group ထဲသို့ Card တင်မည်
    await bot.telegram.sendMessage(GROUP_ID,
      `========================================\n` +
      `🛡️ 5vs5 PLAYER RECRUITMENT\n` +
      `========================================\n` +
      `💰 Fee: ${fee}\n` +
      `🎯 လိုအပ်သော Roles: ${rolesList}\n` +
      `👤 Host: ${hostName}\n` +
      `status: 🟢 OPEN FOR PLAYERS\n` +
      `========================================`,
      Markup.inlineKeyboard([
        [Markup.button.callback('⚔️ ဝင်ရောက်ရန် (Join Match)', 'join_match')]
      ])
    );

    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ သင်၏ Card ကို Eternal Aura Group ထဲသို့ အောင်မြင်စွာ တင်ပြီးပါပြီ!');
  } catch (error) {
    await ctx.answerCbQuery('❌ Group ထဲသို့ ပို့၍မရပါ။ Bot ကို Group ထဲ Admin ထည့်ထားခြင်း ရှိမရှိ စစ်ဆေးပါ။', { show_alert: true });
  }
});

bot.action('join_match', async (ctx) => {
  await ctx.answerCbQuery('ဒီပွဲအတွက် Host ထံ တိုက်ရိုက် ဆက်သွယ်လိုက်ပါ!');
});

// Vercel Webhook Handler
module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(200).json({ message: 'Bot active' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};