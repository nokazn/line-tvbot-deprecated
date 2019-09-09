'use strict'

const line = require('@line/bot-sdk');
const path = require('path');
const dotenvConfig = require('dotenv').config();

function pushMessage (msg) {
  if (typeof process.env.CHANNEL_ACCESS_TOKEN === 'undefined' || typeof process.env.CHANNEL_SECRET === 'undefined') {
    console.error(dotenvConfig);
    console.error({ CHANNEL_ACCESS_TOKEN: process.env.CHANNEL_ACCESS_TOKEN });
    console.error({ CHANNEL_SECRET: process.env.CHANNEL_SECRET });
  }
  const client = new line.Client({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
  });

  const message = {
    type: 'text',
    text: msg
  };

  client.pushMessage(process.env.USER_ID, message).then((res) => {
    console.info(res);
  }).catch((err) => {
    console.error(err);
  });
};

module.exports.pushMessage = pushMessage;
