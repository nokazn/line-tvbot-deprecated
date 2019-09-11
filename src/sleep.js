'use strict';

/**
 * time ms だけ待機
 * @param {number} time
 * @return {Promise}
 */
module.exports = time => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
