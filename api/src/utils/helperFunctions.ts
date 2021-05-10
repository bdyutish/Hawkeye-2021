import stringSimilarity from 'string-similarity';

export const compareAnswers = (input: string, answer: string) => {
  const ratio = stringSimilarity.compareTwoStrings(input, answer);

  return ratio;
};
