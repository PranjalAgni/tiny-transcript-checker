/* eslint-disable no-cond-assign */
import stringSimilarity from 'string-similarity';

const cleanToArray = (input) => {
  const PUNCTUATION_REGEX = /[.,/#!$%^&*;:{}=?\-_`~()]/g;
  const MULTIPLE_SPACES_REGEX = /\s\s+/g;

  return input
    .trim()
    .toLowerCase()
    .replace(PUNCTUATION_REGEX, ' ')
    .replace(MULTIPLE_SPACES_REGEX, ' ')
    .split(' ');
};

const isSimilar = (wordA, wordB) => {
  const similarity = stringSimilarity.compareTwoStrings(wordA, wordB);
  console.log('Simalrity for: ', similarity);
  if (similarity >= 0.6) return true;

  return false;
};

const isPresentForward = (strA, strB, astart, bstart, limit = 1) => {
  const alen = strA.length;
  let found = null;
  for (let i = astart; i <= astart + limit && i < alen; i += 1) {
    if (strA[i] === strB[bstart]) {
      found = i;
      break;
    }
  }

  if (!found) return false;

  return {
    nextStart: found,
    missed: found - astart
  };
};

const isPresentBackward = (strA, strB, astart, bstart, limit = 1) => {
  let found = null;

  for (let i = astart; i >= astart - limit && i >= 0; i -= 1) {
    if (strA[i] === strB[bstart]) {
      found = i;
      break;
    }
  }

  if (!found) return false;

  return {
    nextStart: found,
    missed: astart - found
  };
};

const computeAccuracy = (actual, predicted) => {
  const actualClean = cleanToArray(actual);
  const predictedClean = cleanToArray(predicted);

  const actualCleanLen = actualClean.length;
  const predictedCleanLen = predictedClean.length;

  let aidx = 0;
  let pidx = 0;
  const wordsMissed = [];
  const wordsWrong = [];
  let status;

  while (aidx < actualCleanLen && pidx < predictedCleanLen) {
    if (actualClean[aidx] === predictedClean[pidx]) {
      aidx += 1;
      pidx += 1;
    } else if (isSimilar(actualClean[aidx], predictedClean[pidx])) {
      console.log('Wrong word is: ', actualClean[aidx], predictedClean[pidx]);
      wordsWrong.push(actualClean[aidx]);
      aidx += 1;
      pidx += 1;
    } else if ((status = isPresentForward(predictedClean, actualClean, pidx, aidx, 5)) !== false) {
      // forward case -- here it means word is matched in future

      console.log('Word matched in forward search: ', actualClean[status.nextStart]);
      pidx = status.nextStart + 1;
      aidx += 1;
    } else if ((status = isPresentBackward(predictedClean, actualClean, pidx, aidx, 5) !== false)) {
      // backward case -- here it means word is matched in past

      console.log('Word matched in backward search: ', actualClean[status.nextStart]);
      // words_missed += 1;
      aidx += 1;
      pidx = status.nextStart + 1;
    } else {
      console.log('Wrong missed is: ', actualClean[aidx]);
      wordsMissed.push(actualClean[aidx]);
      aidx += 1;
      pidx += 1;
    }
  }

  const totalIncorrect = wordsMissed.length + wordsWrong.length;
  const accuracyPercent = (actualCleanLen - totalIncorrect) / actualCleanLen;
  console.log('Words incorrect: ', wordsWrong);
  console.log('Words missed: ', wordsMissed);
  console.log('Accuracy: ', accuracyPercent * 100);

  return {
    incorrectWords: wordsWrong,
    missedWords: wordsMissed,
    accuracy: accuracyPercent * 100
  };
};

export default {
  computeAccuracy
};
