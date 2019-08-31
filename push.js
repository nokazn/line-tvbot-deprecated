'use strict'

const line = require('@line/bot-sdk');
require('dotenv').config();

function pushMessage (msg) {
  const client = new line.Client({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
  });

  const message = {
    type: 'text',
    text: msg
  };

  client.pushMessage(process.env.USER_ID, message).then((res) => {
    console.log(res)
    console.table(res)
  }).catch((err) => {
    console.error(err)
  })
};

module.exports.pushMessage = pushMessage;
