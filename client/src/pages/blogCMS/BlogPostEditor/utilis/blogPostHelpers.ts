export const formatDate = (date?: string): string => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString();
};

export const getWordCount = (content?: string): number => {
  if (!content) return 0;
  return content.trim().split(/\s+/).length;
};

export const getReadingTime = (content?: string): string => {
  const wordsPerMinute = 200;
  const wordCount = getWordCount(content);
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};
