const Base = require('./lib/base.js');
const scales = require('./lib/scales.js');
const TelegramBot = require('node-telegram-bot-api');

const PAGES = require('./content.js');
const TOKEN = process.env.TG_BOT_WEIGHT_MONITOR_TOKEN;

process.title = 'tg-weight-monitor-bot';

const bot = new TelegramBot(TOKEN, {polling: true});
bot.on('message', onMessage);
bot.on('callback_query', onCallbackQuery);

const base = new Base();

function onMessage(msg) {
  console.log(msg);
  if (msg.text && msg.text.toLowerCase().indexOf('/start') === 0) {
    bot.sendMessage(msg.chat.id, PAGES.welcomeScreen.text, {reply_markup: PAGES.welcomeScreen.replyMarkup, disable_notification: true}).then((msg) => {
      console.log(msg);
    });
  } else if (base.isUserExists(msg.from.id) && base.getUserStatus(msg.from.id) === 'new_weight') {
    if(!scales.validateWeight(msg.text)) {
      base.updateUser({id: msg.chat.id, status: 'idle'});
      refreshPage(msg, PAGES.incorrectWeight);
    } else {
      base.updateUser({id: msg.chat.id, status: msg.text});
      refreshPage(msg, PAGES.weightConfirmation(msg.text, base.getUserUnits(msg.chat.id)));
    }
  } else {
    refreshPage(msg, PAGES.helpPage);
  }
}

function onCallbackQuery(clbq) {
  console.log(clbq);
  if (clbq.data) {
    if (clbq.data === 'kg' || clbq.data === 'lb') {
      base.addUser(Object.assign({}, clbq.from, {units: clbq.data, lastMessage: clbq.message.message_id, status: 'idle'}));
      setPage(clbq, PAGES.mainMenu);
    } else if (clbq.data === 'new_weight') {
      base.updateUser({id: clbq.message.chat.id, status: 'new_weight'});
      setPage(clbq, PAGES.newWeight);
    } else if (clbq.data === 'main_menu') {
      base.updateUser({id: clbq.message.chat.id, status: 'idle'});
      setPage(clbq, PAGES.mainMenu);
    } else if (clbq.data === 'cancel_weight') {
      base.updateUser({id: clbq.message.chat.id, status: 'new_weight'});
      setPage(clbq, PAGES.newWeight);
    } else if (clbq.data === 'confirm_weight') {
      const weightData = scales.makeWeightData(base.getUserStatus(clbq.message.chat.id));
      base.updateUser({id: clbq.message.chat.id, weight: weightData, status: 'idle'});
      const userWeight = base.getUserLastWeight(clbq.message.chat.id);
      const userUnits = base.getUserUnits(clbq.message.chat.id);
      setPage(clbq, PAGES.weightResult(scales.formatConfirmation(userWeight, userUnits)));
    } else if (clbq.data === 'show_stats') {
      setPage(clbq, PAGES.statsMainMenu);
    } else if (clbq.data === 'stat_last_seven_measurings') {
      const text = scales.formatLastMeasurings(base.getLastEightWeights(clbq.message.chat.id), base.getUserUnits(clbq.message.chat.id));
      setPage(clbq, PAGES.statsLastSevenMeasurings(text));
    }
  }
}

function setPage(data, page) {
  const chatId = data.data !== undefined ? data.message.chat.id : data.chat.id;
  const messageId = data.data !== undefined ? data.message.message_id : base.getUserLastMessageId(data.from.id);
  const callbackQueryId = data.data !== undefined ? data.id : null;
  bot.editMessageText(page.text, {chat_id: chatId, message_id: messageId, parse_mode: 'html'})
    .then(function(){
      bot.editMessageReplyMarkup(page.replyMarkup, {chat_id: chatId, message_id: messageId});
    });
  if (callbackQueryId !== null ) {
    bot.answerCallbackQuery(callbackQueryId);
  }
}

function refreshPage(msg, page) {
  let ok = false;
  bot.deleteMessage(msg.chat.id, base.getUserLastMessageId(msg.from.id))
    .then(function() {
      bot.sendMessage(msg.chat.id, page.text, {reply_markup: page.replyMarkup})
        .then(function (msg) {
          base.updateUser({id: msg.chat.id, lastMessage: msg.message_id});
          ok = true;
        });
      }).catch(() => {
      console.log('Cant delete message while "trash message"');
      if (!ok) {
        bot.sendMessage(msg.chat.id, page.text, {reply_markup: page.replyMarkup})
          .then(function (msg) {
            base.updateUser({id: msg.chat.id, lastMessage: msg.message_id});
            ok = true;
          });
        }
    });
}
