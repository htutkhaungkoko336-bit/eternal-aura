const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const GROUP_ID = process.env.ETERNAL_AURA_CLIENT_GP_ID;

// /recrut 10k gold,roam လို့ ရိုက်လိုက်တာကို ချက်ချင်းဖမ်းရန်
bot.command('recrut', async (ctx) => {
  const messageText = ctx.message.text; // ဥပမာ: "/recrut 10k gold,roam"
  const args = messageText.replace('/recrut', '').trim().split(' ');

  // အကယ်၍ fee နဲ့ roles တွေ ဖြည့်ပြီးသားဆိုလျှင် (ဥပမာ: 10k gold,roam)
  if (args.length >= 2 && args[0] !== '') {
    const fee = args[0].toUpperCase();
    const roles = args.slice(1).join(' ').toUpperCase();
    const hostName = ctx.from.first_name || 'Host';

    try {
      await bot.telegram.sendMessage(GROUP_ID,
        `========================================\n` +
        `🛡️ 5vs5 PLAYER RECRUITMENT\n` +
        `========================================\n` +
        `💰 Fee: ${fee}\n` +
        `🎯 လိုအပ်သော Roles: ${roles}\n` +
        `👤 Host: ${hostName}\n` +
        `status: 🟢 OPEN FOR PLAYERS\n` +
        `========================================`,
        Markup.inlineKeyboard([
          [Markup.button.callback('⚔️ ဝင်ရောက်ရန် (Join Match)', 'join_match')]
        ])
      );

      return ctx.reply('✅ သင်၏ လူခေါ်ဆိုမှု Card ကို Group ထဲသို့ အောင်မြင်စွာ တင်လိုက်ပါပြီ!');
    } catch (error) {
      return ctx.reply(`❌ Error: Group ထဲသို့ ပို့၍မရပါ။ (Bot ကို Group ထဲမှာ Admin ထည့်ထားရဲ့လား စစ်ပါ)`);
    }
  }

  // Parameter မပါဘဲ ရိုးရိုး /recrut ပဲ ရိုက်ရင် PM ထဲသွားရန် လင့်ခ်ပြမည်
  const botUsername = ctx.botInfo ? ctx.botInfo.username : 'eternal_aura_bot';
  ctx.reply('👇 ပုံစံမှန်ဖြင့် ရိုက်ပါ (ဥပမာ: `/recrut 10k gold,roam`) သို့မဟုတ် Bot PM ထဲတွင် ရွေးချယ်ပါ:', 
    Markup.inlineKeyboard([
      [Markup.button.url('🤖 Bot PM ထဲတွင် ရွေးမည်', `https://t.me/${botUsername}?start=recrut`)]
    ])
  );
});

// Bot PM ထဲတွင် /start recrut နှိပ်သည့်အခါ
bot.start(async (ctx) => {
  if (ctx.startPayload === 'recrut') {
    return ctx.reply('💰 ကြေးပမာဏ ရွေးပါ:', Markup.inlineKeyboard([
      [Markup.button.callback('5k MMK', 'pmfee_5K'), Markup.button.callback('10k MMK', 'pmfee_10K')],
      [Markup.button.callback('15k MMK', 'pmfee_15K'), Markup.button.callback('25k MMK', 'pmfee_25K')],
      [Markup.button.callback('50k MMK', 'pmfee_50K')]
    ]));
  }
  ctx.reply('Eternal Aura Matchmaking Bot မှ ကြိုဆိုပါတယ်!');
});

bot.action(/^pmfee_(.+)$/, async (ctx) => {
  const fee = ctx.match[1];
  await ctx.answerCbQuery();
  
  await ctx.editMessageText(`💰 Fee: ${fee}\n\n🎯 လိုအပ်သော Role ကို ရွေးချယ်ပါ:`, Markup.inlineKeyboard([
    [Markup.button.callback('⚔️ Gold Lane', `sendcard_${fee}_GOLD`)],
    [Markup.button.callback('🛡️ Roam', `sendcard_${fee}_ROAM`)],
    [Markup.button.callback('🌴 Jungler', `sendcard_${fee}_JG`)],
    [Markup.button.callback('🧙‍♂️ Mid Lane', `sendcard_${fee}_MID`)],
    [Markup.button.callback('🗡️ EXP Lane', `sendcard_${fee}_EXP`)],
    [Markup.button.callback('🔥 Any Role', `sendcard_${fee}_ANY`)]
  ]));
});

bot.action(/^sendcard_(.+)_(.+)$/, async (ctx) => {
  const fee = ctx.match[1];
  const role = ctx.match[2];
  const hostName = ctx.from.first_name || 'Host';

  await bot.telegram.sendMessage(GROUP_ID,
    `========================================\n` +
    `🛡️ 5vs5 PLAYER RECRUITMENT\n` +
    `========================================\n` +
    `💰 Fee: ${fee}\n` +
    `🎯 လိုအပ်သော Roles: ${role}\n` +
    `👤 Host: ${hostName}\n` +
    `status: 🟢 OPEN FOR PLAYERS\n` +
    `========================================`,
    Markup.inlineKeyboard([
      [Markup.button.callback('⚔️ ဝင်ရောက်ရန် (Join Match)', 'join_match')]
    ])
  );

  await ctx.answerCbQuery();
  await ctx.editMessageText('✅ Card ကို Group ထဲသို့ အောင်မြင်စွာ တင်လိုက်ပါပြီ!');
});

bot.action('join_match', async (ctx) => {
  await ctx.answerCbQuery('ဒီပွဲအတွက် ချိတ်ဆက်ရန် Host ထံ သို့မဟုတ် Website သို့ ဆက်သွယ်ပါ!');
});

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(200).json({ message: 'Active' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};