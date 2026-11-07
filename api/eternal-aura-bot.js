const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const GROUP_ID = process.env.ETERNAL_AURA_CLIENT_GP_ID;

// ယာယီ သိမ်းဆည်းရန် (User တစ်ယောက်ချင်းစီရဲ့ ရွေးချယ်မှုများ)
const userChoices = {};

// /start လို့ ရိုက်လိုက်တာနဲ့ Fee ရွေးခိုင်းမည့် Menu ပေါ်လာမည်
bot.command('start', async (ctx) => {
  const userId = ctx.from.id;
  userChoices[userId] = { fee: '', roles: [] };

  await ctx.reply('💰 ကျေးဇူးပြု၍ ကြေးပွဲပမာဏ (Fee) ကို ရွေးချယ်ပါ:', Markup.inlineKeyboard([
    [Markup.button.callback('5k MMK', 'set_fee_5K'), Markup.button.callback('10k MMK', 'set_fee_10K')],
    [Markup.button.callback('15k MMK', 'set_fee_15K'), Markup.button.callback('25k MMK', 'set_fee_25K')],
    [Markup.button.callback('50k MMK', 'set_fee_50K')]
  ]));
});

// Fee ရွေးချယ်မှုကို ဖမ်းယူပြီး Role ဆက်ရွေးခိုင်းခြင်း
bot.action(/^set_fee_(.+)$/, async (ctx) => {
  const userId = ctx.from.id;
  const fee = ctx.match[1];

  if (!userChoices[userId]) userChoices[userId] = { roles: [] };
  userChoices[userId].fee = fee;

  await ctx.answerCbQuery();
  await ctx.editMessageText(`💰 ရွေးချယ်ထားသော Fee: ${fee}\n\n🎯 လိုအပ်သော Role များကို ရွေးချယ်ပါ (ပြီးလျှင် "✅ ပြီးဆုံးပါပြီ (Done)" ကို နှိပ်ပါ):`, Markup.inlineKeyboard([
    [Markup.button.callback('⚔️ Gold Lane', 'toggle_role_GOLD'), Markup.button.callback('🛡️ Roam', 'toggle_role_ROAM')],
    [Markup.button.callback('🌴 Jungler', 'toggle_role_JG'), Markup.button.callback('🧙‍♂️ Mid Lane', 'toggle_role_MID')],
    [Markup.button.callback('🗡️ EXP Lane', 'toggle_role_EXP'), Markup.button.callback('🔥 Any Role', 'toggle_role_ANY')],
    [Markup.button.callback('✅ ပြီးဆုံးပါပြီ (Done)', 'finish_recruitment')]
  ]));
});

// Role များကို အလိုရှိသလို ဖြည့်/ဖျက် လုပ်ဆောင်ခြင်း
bot.action(/^toggle_role_(.+)$/, async (ctx) => {
  const userId = ctx.from.id;
  const role = ctx.match[1];

  if (!userChoices[userId]) userChoices[userId] = { roles: [] };
  
  const roles = userChoices[userId].roles;
  const index = roles.indexOf(role);

  if (index > -1) {
    roles.splice(index, 1); // ပါပြီးသားဆိုရင် ပြန်ဖြုတ်မယ်
  } else {
    roles.push(role); // မပါသေးရင် ထည့်မယ်
  }

  const currentFee = userChoices[userId].fee;
  const selectedRolesText = roles.length > 0 ? roles.join(', ') : 'မရွေးရသေးပါ';

  await ctx.answerCbQuery(`Role: ${role} ကို ပြင်ဆင်ပြီးပါပြီ`);
  await ctx.editMessageText(`💰 Fee: ${currentFee}\n🎯 ရွေးထားသော Roles: ${selectedRolesText}\n\nဆက်လက်ရွေးချယ်ပါ သို့မဟုတ် ပြီးလျှင် Done နှိပ်ပါ:`, Markup.inlineKeyboard([
    [Markup.button.callback('⚔️ Gold Lane', 'toggle_role_GOLD'), Markup.button.callback('🛡️ Roam', 'toggle_role_ROAM')],
    [Markup.button.callback('🌴 Jungler', 'toggle_role_JG'), Markup.button.callback('🧙‍♂️ Mid Lane', 'toggle_role_MID')],
    [Markup.button.callback('🗡️ EXP Lane', 'toggle_role_EXP'), Markup.button.callback('🔥 Any Role', 'toggle_role_ANY')],
    [Markup.button.callback('✅ ပြီးဆုံးပါပြီ (Done)', 'finish_recruitment')]
  ]));
});

// အားလုံးပြီးဆုံး၍ Group ထဲသို့ Card တင်မည့် အဆင့်
bot.action('finish_recruitment', async (ctx) => {
  const userId = ctx.from.id;
  const data = userChoices[userId];

  if (!data || !data.fee || data.roles.length === 0) {
    return ctx.answerCbQuery('ကျေးဇူးပြု၍ Fee နှင့် Role တစ်ခုခုကို အရင်ရွေးချယ်ပါ။', { show_alert: true });
  }

  const hostName = ctx.from.first_name || 'Host';
  const fee = data.fee;
  const rolesList = data.roles.join(', ');

  try {
    // Group ထဲသို့ Card ပို့မည်
    await bot.telegram.sendMessage(GROUP_ID,
      `========================================\n` +
      `🛡️ 5vs5 PLAYER RECRUITMENT\n` +
      `========================================\n` +
      `💰 Fee: ${fee}\n` +
      `🎯 လိုအပ်သော Roles: ${rolesList}\n` +
      `👤 Host: ${hostName}\n` +
      `status: 🟢 OPEN FOR PLAYERS\n` +
      `========================================\n` +
      `👇 ပါဝင်လိုသူများ ဝင်ရောက်ရန် ခလုတ်ကို နှိပ်ပါ။`,
      Markup.inlineKeyboard([
        [Markup.button.callback('⚔️ ဝင်ရောက်ရန် (Join Match)', 'join_match')]
      ])
    );

    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ သင်၏ လူခေါ်ဆိုမှု Card ကို Eternal Aura Group ထဲသို့ အောင်မြင်စွာ တင်ပြီးပါပြီ!');
  } catch (error) {
    await ctx.answerCbQuery('❌ Group ထဲသို့ ပို့၍မရပါ။ Bot ကို Group ထဲမှာ Admin ထည့်ထားခြင်း ရှိမရှိ စစ်ဆေးပါ။', { show_alert: true });
  }
});

bot.action('join_match', async (ctx) => {
  await ctx.answerCbQuery('ဒီပွဲအတွက် Host ထံ တိုက်ရိုက် ဆက်သွယ်လိုက်ပါ!');
});

// Vercel Serverless Function Webhook Handler
module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(200).json({ message: 'Bot is active!' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};