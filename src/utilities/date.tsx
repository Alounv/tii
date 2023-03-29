export const getIsTheSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const getIsToday = (date: Date) => {
  const now = new Date();
  return getIsTheSameDay(date, now);
};

export const getIsYesterday = (date: Date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getIsTheSameDay(date, yesterday);
};
