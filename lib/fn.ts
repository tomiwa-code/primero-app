export const textTrunc = (text: string) => {
  if (!text) {
    return;
  }

  if (text?.length > 30) {
    return `${text.substring(0, 27)}...`;
  }

  return text;
};
