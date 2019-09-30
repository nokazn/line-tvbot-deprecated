import { searchWordsList } from './store';
import sleep from './sleep';
import pushMessage from './push';
import searchPrograms from './searchPrograms';

// @ts-ignore
exports.handler = async (event, context, callback): void => {
  for (let searchWords of searchWordsList) {
    try {
      await notifyPrograms(...searchWords);
    } catch (e) {
      console.error(e);
    }
    await sleep(1500);
  }
};

/**
 * 検索した番組を通知
 */
async function notifyPrograms (searchWords: string, type: number): Promise<void> {
  searchPrograms(searchWords, type).then(allProgramList => {
    console.info({ searchWords, allProgramList });
    if (allProgramList.length) pushMessage({ searchWords, allProgramList });
  }).catch(e => {
    console.error(e)
  });
}
