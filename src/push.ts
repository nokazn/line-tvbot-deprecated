import * as line from '@line/bot-sdk';
import { Program, MyResponse } from './types';

/**
 * searchWords に合致する番組を通知する
 */
export default async function ({ searchWords, allProgramList }: { searchWords: string, allProgramList: Program[]}): Promise<MyResponse> {
  return new Promise((resolve, reject) => {
    const config = require('dotenv').config();
    if (typeof process.env.CHANNEL_ACCESS_TOKEN === 'undefined' || typeof process.env.USER_ID === 'undefined') {
      console.error(config);
      console.error({
        CHANNEL_ACCESS_TOKEN: process.env.CHANNEL_ACCESS_TOKEN,
        USER_ID: process.env.USER_ID
      });
      reject('process.env.CHANNEL_ACCESS_TOKEN が設定されていません。');
    }

    const client = new line.Client({
      channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
    });

    const msgs: (line.TextMessage | line.TemplateMessage)[] = _makeMsgs(searchWords, allProgramList);

    client.pushMessage(process.env.USER_ID!, msgs).then((res: line.MessageAPIResponseBase) => {
      resolve({
        statusCode: 200,
        response: res
      });
    }).catch((e: any) => {
      console.error(e);
      console.error(JSON.stringify({searchWords ,allProgramList ,msgs }, null, '\t'));
      reject({
        statusCode: 400,
        response: e
      });
    });
  });
};

/**
 * メッセージの配列を生成する
 */
function _makeMsgs (searchWords: string, allProgramList: Program[]): (line.TextMessage | line.TemplateMessage)[] {
  const counts = `「${searchWords}」を含む番組が${allProgramList.length}件見つかりました。`;
  // 件数を知らせるテキストメッセージ
  const countMsg: line.TextMessage = {
    type: 'text',
    text: counts
  };

  // 10件ごとに分割する
  const allProgramLists: Program[][] = [];
  while (allProgramList.length) {
    allProgramLists.push(allProgramList.splice(0, 10));
  }

  // 番組を通知するカルーセルの配列を10件ごとに作成する
  const carouselsList: line.TemplateMessage[] = [];
  for (let [i, programList] of Array.from(allProgramLists.entries())) {
    carouselsList.push({
      type: 'template',
      altText: counts,
      template: {
        type: 'carousel',
        columns: programList.map((program: Program): line.TemplateColumn => {
          return {
            title: abbrText(program.name, 40),
            text: abbrText(`${program.date}${program.time}\n${program.broadcaster}\n${program.detail}`, 60),
            actions: [
              {
                type: 'uri',
                label: 'Googleカレンダーに追加',
                uri: program.calendarUrl
              },
              {
                type: 'uri',
                label: '詳細',
                uri: program.href
              }
            ]
          }
        }),
        imageAspectRatio: 'rectangle',
        imageSize: 'cover'
      }
    });
  }
  return [countMsg, ...carouselsList];
}

/**
 * text の長さが length 以上のときは省略する
 */
function abbrText(text: string, length: number): string {
  return text.length >= length ? `${text.substring(0, length - 1)}…` : text;
}
