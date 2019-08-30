//  {1: 'BS', 2: 'CS', 3: '地上波'};
var MYAPP = {
  CHANNEL_ACCESS_TOKEN: 'S0oKprH6/B5pcRV0emkerfTztqGHrgfYX+RIEOd0RzDvPSknzB8kCMyChvesNrYMzOWHxY20GvT8kn9zyLbdfCSYGaoBP3NPuFBi40t7GyufYgw2diZSGcnRwNZ/EkpnXck4TZFVXg941Lc76id/CAdB04t89/1O/w1cDnyilFU=',
  USER_ID: 'U0b35bf46fce4988412461f5d61b91182',
  // ngWordsList: getNgWordsList(),
  // noProgramsList: []
};

// スポーツ番組を検索
function sportsTV() {
  post(['F1', 'LEGENDS'], [2]);
  post(['F1', 'グランプリ'], [1, 2])
  post(['FIA', 'フォーミュラE選手権'], [1, 2]);
  post(['【生】', 'インディカー'], [2]);
  post(['SUPER', 'GT'], [1, 2, 3]);
  post(['スーパーフォーミュラ'], [1, 2, 3]);
  post(['【生】', 'MotoGP'], [2])
  post(['WEC'], [1, 2]);
  post(['ル・マン'], [1, 2]);

  post(['全豪オープンテニス', 'NHK'], [1, 2, 3]);
  post(['全仏', 'テニス'], [1, 2, 3]);
  post(['ウィンブルドン', 'NHK'], [1, 2, 3]);
  post(['全米オープンテニス'], [1, 2]);

  if (MYAPP.noProgramsList.length !== 0) {
    var resultMessage = '***********************************\n'
                        + MYAPP.noProgramsList.join(', ') + 'の検索結果は0件です。'
                        + '\n***********************************';
    pushNotification(resultMessage);
  }  // if
  return;
}

// エンタメ番組を検索
function entertainmentTV() {
  post(['さまぁ～ず'], [3]);

  post(['にちようチャップリン'], [3]);
  post(['家、ついて行ってイイですか'], [3]);
  post(['水曜日のダウンタウン'], [3]);
  post(['ナイトスクープ'], [3]);
  post(['ドキュメント72時間'], [3]);
  post(['有吉の壁'], [3]);

  post(['金曜ロードSHOW'], [3]);
  post(['プレミアムシネマ'], [1]);

  post(['どろろ'], [3]);
  post(['エヴァンゲリオン'], [3]);

  if (MYAPP.noProgramsList.length !== 0) {
    var resultMessage = '***********************************\n'
                        + MYAPP.noProgramsList.join(', ') + 'の検索結果は0件です。'
                        + '\n***********************************';
    pushNotification(resultMessage);
  }  // if
  return;
}


// searchWordList に合致する番組をLINEにプッシュする
// function post(searchWordList, broadcastTypeList) {
// //  MYAPP.
//   var messageList = getProgramList(searchWordList, broadcastTypeList);
// //  番組が少なくとも1つ見つかった場合
//   if (messageList) {
//     var resultMessage = '***********************************\n「'
//                       + searchWordList.join(', ') + '」の検索結果は' + messageList.length + '件です。'
//                       + '\n***********************************';
// //    見つかった番組の数をプッシュ
//     pushNotification(resultMessage);
//     for (var i = 0; i < messageList.length; i++) {
//       pushNotification(messageList[i].text);
//     }  // for
//     return true;
//   } else {
// //    番組が1つも見つからなかった searchWordList は最後にまとめて知らせる
//     MYAPP.noProgramsList.push('「' + searchWordList.join(', ') + '」');
//     return false;
//   }  // if

// //  broadcastTypeList は [1, 2, 3] のように指定
//   function getProgramList(searchWordList, broadcastTypeList) {
//     var parsedProgramList = [];
//     var broadcastTypeMap = {1: 'BS', 2: 'CS', 3: '地上波'};
//     var parsedSearchWordForUrl = searchWordList.join('+');

// //    [t]ype of a broadcaster
//     for (var i in broadcastTypeList) {
// //      [s]tart number of the first program to show / 取得した番組の数
//       var t = broadcastTypeList[i];
//       var s = 0;
// //      s が 0，もしくは10の倍数である間ループ
//       onePage: while (s % 10 === 0) {
//         var url = 'https://tv.yahoo.co.jp/search/?q=' + parsedSearchWordForUrl + '&t=' + t + '&s=' + s;
//         var fetch = UrlFetchApp.fetch(url);
//         var html = fetch.getContentText('UTF-8');

// //        programList の要素を抜き出す
//         var programListSearchTag = '<!-- programlist -->';
//         var indexOfStart = html.indexOf(programListSearchTag);

// //        programList の要素が存在する場合
//         if (indexOfStart !== -1) {
//           var programListStart = html.substring(indexOfStart + programListSearchTag.length);
//           var programList = cutElementEnd(programListStart, '<!-- /programlist -->');

// //          programList の中の最初の program 要素を抜き出す
//           var programSearchTag = '<li>';
//           var indexOfStart = programList.indexOf(programSearchTag);

// //          programList の中の program 要素の数だけループ
//           oneProgram: while (indexOfStart !== -1) {
//             var thisProgramMap = {};

// //            programList が存在すれば <li> タグは少なくとも一つは存在する
//             var programStart = programList.substring(indexOfStart + programSearchTag.length)
//             if (programStart) {var dateStart = fetchElementStart('date', programStart, '<p class='yjMS'><em>', '<')}
//             if (dateStart) {var weekdayStart = fetchElementStart('weekday', dateStart, '</em>', '<')}
//             if (weekdayStart) {var timeStart = fetchElementStart('time', weekdayStart, '<p><em>', '<')}
//             if (timeStart) {var programUrlStart = fetchElementStart('programUrl', timeStart, '<a href='', ''>')}
//             if (programUrlStart) {var titleStart = fetchElementStart('title', programUrlStart, '>', '<')}
//             if (titleStart) {var broadcasterStart = fetchElementStart('broadcaster', titleStart, '<p class='yjMS pb5p'><span class='pr35'>', '<')}
//             if (broadcasterStart) {var detailStart = fetchElementStart('detail', broadcasterStart, '<p class='yjMS pb5p'>', '<')}

//             var programInformation = {
//               date: thisProgramMap.date,
//               weekday: thisProgramMap.weekday,
//               time: thisProgramMap.time,
//               title: thisProgramMap.title,
//               programUrl: 'https://tv.yahoo.co.jp' + thisProgramMap.programUrl,
//               broadcaster: thisProgramMap.broadcaster,
//               detail: thisProgramMap.detail,
//               text: '日時: ' + thisProgramMap.date + thisProgramMap.weekday + thisProgramMap.time +'\n'
//                     + '番組名: ' + thisProgramMap.title + '\n'
//                     + '放送局: ' + thisProgramMap.broadcaster + '\n\n'
//                     + '詳細: ' + thisProgramMap.detail + '\n'
//                     + 'https://tv.yahoo.co.jp' + thisProgramMap.programUrl + '\n'
//             };

// //            <li>program</li> の部分はもう出力したので削る
//             indexOfStart = programStart.indexOf('</li>');
//             programList = programStart.substring(thisProgramMap.indexOfStart + '</li>'.length);

// //            次の <li>program</li> の部分の indexOfStart を探す
//             indexOfStart = programList.indexOf('<li>');
// //            onePage の中で取得済みの番組数
//             s++;

// //            ngWordsList の中のNGワードが programInformation.text に含まれていた場合次の oneProgram のループに移る
//             for (var i in MYAPP.ngWordsList) {
//               if (programInformation.text.indexOf(MYAPP.ngWordsList[i][0]) !== -1) {
//                 continue oneProgram;
//               }  // if
//             }  // for

// //            parsedProgramList に programInformation を push する
//             parsedProgramList.push(programInformation);

//             Utilities.sleep(1000);

//           }  // oneProgram: while
// //        programList が存在せず，それが1ページ目の場合
//         } else if (s === 0)  {
//           Utilities.sleep(1000);
//           break onePage;
//         }  // if
//       }  // onePage: while
//     }  // for

//     console.log(parsedProgramList);
//     return (parsedProgramList.length !== 0 ? parsedProgramList : false);


// //    始まりの端をカットする
//     function fetchElementStart(elementName, previousElementStart, searchTagOfStart, searchTagOfEnd) {
// //      searchTagOfStart が現れるまでに previousElementStart に何文字あるか
//       var indexOfStart = previousElementStart.indexOf(searchTagOfStart);
//       if (indexOfStart !== -1) {
// //        indexOfStart + searchTagOfStart.length 文字目のところから最後まで抜き出す
//         var elementStart = previousElementStart.substring(indexOfStart + searchTagOfStart.length);
// //        searchTagOfEnd が現れるまでの文字を抜き出す
//         thisProgramMap[elementName] = cutElementEnd(elementStart, searchTagOfEnd);
//         return elementStart;
//       } else {
//         thisProgramMap[elementName] = '???';
//         return false
//       }  // if
//     }  // fetchElementStart(elementName, previousElementStart, searchTagOfStart, searchTagOfEnd)

// //    終わりの端をカットする
//     function cutElementEnd(elementStart, searchTagOfEnd) {
// //      searchTagOfEnd が現れるまでに elementStart に何文字あるか
//       var indexOfEnd = elementStart.indexOf(searchTagOfEnd);
//       if (indexOfEnd !== -1) {
// //        始めから (indexOfEnd - 1) 文字目のところまで抜き出す
//         var elment = elementStart.substring(0, indexOfEnd);
//         return elment;
//       } else {
//         return false;
//       }
//     }
//   }
// }


//  message を LINE へプッシュする

function pushNotification(message){
  const url = 'https://api.line.me/v2/bot/message/push';

  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + MYAPP.CHANNEL_ACCESS_TOKEN
  };

  const postData = {
    'to': MYAPP.USER_ID,
    'messages': [
      {
        'type': 'text',
        'text': message
      }
    ]
  };

  const options = {
    'method': 'post',
    'headers': headers,
    'payload': JSON.stringify(postData)
  };
  return fetch(url, options);
}

pushNotification("aiueo")


// 「ngWords」というシートから ngWordsList を取得する
// function getNgWordsList() {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ngWords');
//   var ngWordsList = sheet.getRange('A:A').getValues().filter(String);
//   return ngWordsList;
// }
