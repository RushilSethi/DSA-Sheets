import { Question } from '../types';

export const mapNeetcode150 = (data: any): Question[] => {
  const questions: Question[] = [];
  data.categories.forEach((cat: any) => {
    cat.problems.forEach((q: any) => {
      questions.push({
        id: `neetcode150-${q.id}`,
        name: q.name,
        difficulty: q.difficulty,
        topic: cat.name,
        url: q.link,
        sheetName: 'NeetCode 150',
        platform: 'LeetCode',
        pattern: q.pattern,
        leetcodeNumber: q.leetcode_number
      });
    });
  });
  return questions;
};
