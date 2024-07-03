export const isNumericString = (value: string) => {
  const NUMBER_REGEX = /^\d+$/;
  return NUMBER_REGEX.test(value);
};

export const containsNonKorean = (value: string) => {
  const NON_KOREAN_REGEX = /[^가-힣ㄱ-ㅎㅏ-ㅣ]/;
  return NON_KOREAN_REGEX.test(value);
};
