import { searchWordsList } from './store';
import sleep from './sleep';
import pushMessage from './push.js';
import searchPrograms from './searchPrograms.js';

// @ts-ignore
exports.handler = async (event, context, callback) => {
  for (let searchWords of searchWordsList) {
    await notifyPrograms(...searchWords);
    await sleep(1000);
  }
};

/**
 * 検索した番組を通知
 * @return {?Response} response
 */
async function notifyPrograms (searchWords: string, type: number): Promise<Response | null> {
  const allProgramList = await searchPrograms(searchWords, type);
  if (!allProgramList.length) return null;
  const response = await pushMessage({ searchWords, allProgramList });
  console.info({ allProgramList, response });
  return response;
}
