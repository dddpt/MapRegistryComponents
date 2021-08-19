export const nullIfEmpty = (item) => (item && item.length > 0 ? item : null);

export const emptyIfNull = (item) => (item ? item : "");

export const applyNullIfEmpty = (applyFunc) => (string) =>
  applyFunc(nullIfEmpty(string));

export const areArraysEqual = (array1, array2) => {
  return (
    (!array1 && array1 === array2) ||
    (array1 &&
      array2 &&
      array1.length === array2.length &&
      array1.every((value, index) => value === array2[index]))
  );
};
