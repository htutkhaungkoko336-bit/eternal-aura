const { Telegraf, Markup } = require('telegraf');

// Telegram Bot Token နှင့် Group ID ကို Environment Variables မှ ယူမည်
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const GROUP_ID = process.env.ETERNAL_AURA_CLIENT_GP_ID;

// Temporary session သိမ်းရန် (Production မှာ Database သုံးသင့်ပါတယ်)
const userSessions = {};

// /recrut သို့မဟုတ် လူခေါ်ရန် စတင်ချိန်
bot.command('recrut', (ctx) => {
  const userId = ctx.from.id;
  userSessions[userId] = { roles: [] }; // စတင် initialize လုပ်မည်

  ctx.reply('💰 ကျေးဇူးပြု၍ ကြေးပွဲပမာဏ (Fee) ကို ရွေးချယ်ပါ:', Markup.inlineKeyboard([
    [Markup.button.callback('5k MMK', 'fee_5k'), Markup.button.callback('10k MMK', 'fee_10k')],
    [Markup.button.callback('15k MMK', 'fee_15k'), Markup.button.callback('25k MMK', 'fee_25k')],
    [Markup.button.callback('50k MMK', 'fee_50k')]
  ]));
});

// Fee ရွေးချယ်မှုကို ဖမ်းယူခြင်း
bot.action(/^fee_(.+)$/, async (ctx) => {
  const userId = ctx.from.id;
  const fee = ctx.match[1];
  
  if (!userSessions[userId]) userSessions[userId] = {};
  userSessions[userId].fee = fee.toUpperCase();

  await ctx.answerCbQuery();
  
  // Fee ပြီးရင် Role ရွေးခိုင်းမည် (Multi-select ပုံစံပြရန်)
  await ctx.editMessageText(`💰 ရွေးချယ်ထားသော Fee: ${userSessions[userId].fee}\n\n🎯 လိုအပ်သော Role များကို ရွေးချယ်ပါ (ပြီးလျှင် "Done" နှိပ်ပါ):`, Markup.inlineKeyboard([
    [Markup.button.callback('⚔️ Gold Lane', 'role_gold'), Markup.button.callback('🛡️ Roam', 'role_roam')],
    [Markup.button.callback('🌴 Jungler', 'role_jg'), Markup.button.callback('🧙‍♂️ Mid Lane', 'role_mid')],
    [Markup.button.callback('🗡️ EXP Lane', 'role_exp')],
    [Markup.button.callback('✅ ရွေးချယ်ပြီးပါပြီ (Done)', 'role_done')]
  ]));
});

// Role များကို နှိပ်၍ သိမ်းဆည်းခြင်း
bot.action(/^role_(.+)$/, async (ctx) => {
  const userId = ctx.from.id;
  const action = ctx.match[1];
  
  if (!userSessions[userId]) userSessions[userId] = { roles: [] };

  if (action === 'done') {
    await ctx.answerCbQuery();
    return sendRecruitmentCard(ctx, userId);
  }

  const roleName = action.toUpperCase();
  if (!userSessions[userId].roles.includes(roleName)) {
    userSessions[userId].roles.push(roleName);
  }

  await ctx.answerCbQuery(`Added ${roleName}! Current roles: ${userSessions[userId].roles.join(', ')}`);
});

// Group ထဲသို့ လူခေါ်သည့် Card ပို့ပေးမည့် Function
async function sendRecruitmentCard(ctx, userId) {
  const session = userSessions[userId];
  const hostName = ctx.from.first_name;
  const rolesList = session.roles.length > 0 ? session.roles.join(', ') : 'Any Role';

  // Group ထဲသို့ Message ပို့ခြင်း (Environment Variable မှ Group ID ကို သုံးသည်)
  await bot.telegram.sendMessage(GROUP_ID, 
    `========================================\n` +
    `🛡️ 5vs5 PLAYER RECRUITMENT\n` +
    `========================================\n` +
    `💰 Fee: ${session.fee}\n` +
    `🎯 လိုအပ်သော Roles: ${rolesList}\n` +
    `👤 Host: ${hostName}\n` +
    `status: 🟢 OPEN FOR PLAYERS\n` +
    `========================================`, 
    Markup.inlineKeyboard([
      [Markup.button.callback('⚔️ ဝင်ရောက်ရန် (Join Match)', 'join_match')]
    ])
  );

  await ctx.editMessageText('✅ သင်၏ လူခေါ်ဆိုမှု Card ကို Telegram Group ထဲသို့ အောင်မြင်စွာ တင်လိုက်ပါပြီ!');
}

// Group ထဲက Join Button နှိပ်ခြင်းကို ဖမ်းရန်
bot.action('join_match', async (ctx) => {
  await ctx.answerCbQuery('ဒီပွဲအတွက် ချိတ်ဆက်ရန် Website သို့မဟုတ် Host ထံ ဆက်သွယ်ပါ!');
});

bot.launch();
console.log('Eternal Aura Telegram Bot is running...');