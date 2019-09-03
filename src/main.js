'use strict'

const { pushMessage } = require('./push.js');
const { searchPrograms, sleep } = require('./searchPrograms.js');

const rmReair = programList => programList.filter(program => !program.detail.includes('再放送'));
const rmJSports4 = programList => programList.filter(program => !program.boradcaster.includes('J SPORTS 4'));

(async function main () {
  await notifyPrograms('F1 LEGENDS', 2);
  await notifyPrograms('F1 グランプリ フジテレビ', 12, rmReair);
  await notifyPrograms('フォーミュラE選手権', 12, rmJSports4);
  await notifyPrograms('【生】 インディカー ', 12);
  await notifyPrograms('SUPER GT', 123);
  await notifyPrograms('スーパーフォーミュラ', 123);
  await notifyPrograms('【生】 MotoGP', 12);
  await notifyPrograms('WEC', 12);
  await notifyPrograms('WEC', 12);
  await notifyPrograms('ル・マン', 12);

  await notifyPrograms('全豪オープンテニス NHK', 13);
  await notifyPrograms('全仏 テニス', 123);
  await notifyPrograms('ウィンブルドン NHK', 13);
  await notifyPrograms('全米 テニス', 123);

  await notifyPrograms('さまぁ～ず', 3);
  await notifyPrograms('にちようチャップリン', 3);
  await notifyPrograms('家、ついて行ってイイですか', 3);
  await notifyPrograms('水曜日のダウンタウン', 3);
  await notifyPrograms('探偵!ナイトスクープ', 3);
  await notifyPrograms('ドキュメント72時間', 3);
  await notifyPrograms('有吉の壁', 3);

  await notifyPrograms('金曜ロードSHOW', 3)
  await notifyPrograms('プレミアムシネマ', 3)

  notifyPrograms('エヴァンゲリオン', 123)
})();

async function notifyPrograms (searchWords, type) {
  const programList = await searchPrograms(searchWords, type);
  if (!programList.length) return false;
  pushMessage(`「${searchWords}」を含む番組が${programList.length}件見つかりました。`);
  await sleep(1000);
  for (let program of programList) {
    let msg = `【日時】${program.date}${program.time}\n【番組名】${program.name}\n【放送局】${program.broadcaster}\n【詳細】${program.detail}`;
    pushMessage(msg);
    await sleep(1000);
  }
  console.table(programList);
  return programList;
}
