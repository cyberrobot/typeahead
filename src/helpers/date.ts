// Get week day from date
export const getLocalDate = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-GB', {
    weekday: 'short',
  });
};
