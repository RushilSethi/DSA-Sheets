import { Question } from '../types';

export const mapStriversSDE = (data: any): Question[] => {
  const questions: Question[] = [];
  data.topics.forEach((topic: any) => {
    topic.problems.forEach((q: any, index: number) => {
      questions.push({
        id: `strivers-sde-${topic.topic}-${index}`,
        name: q.name,
        difficulty: q.difficulty,
        topic: topic.topic,
        url: q.link,
        sheetName: 'Striver SDE Sheet',
        platform: q.platform
      });
    });
  });
  return questions;
};
