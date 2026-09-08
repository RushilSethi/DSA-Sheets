import { Question } from '../types';

export const map450DSA = (data: any): Question[] => {
  return data.Sheet1.map((q: any, index: number) => ({
    id: `450dsa-${index}`,
    name: q['Problem: '],
    topic: q['Topic:'],
    url: q['URL'],
    sheetName: '450 DSA',
    platform: q['URL'].includes('leetcode') ? 'LeetCode' : 'GFG'
  }));
};
