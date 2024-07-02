export const isNumericString = (value: string) => {
  const NUMBER_REGEX = /^\d+$/;
  return NUMBER_REGEX.test(value);
};
