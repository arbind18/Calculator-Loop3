import type { TrainingCategory } from '../types';

export const constructionCategory: TrainingCategory = {
  id: 'construction',
  title: { en: 'Construction', hi: 'Construction' },
  description: {
    en: 'Construction calculators + supporting knowledge sources.',
    hi: 'Construction calculators + supporting knowledge sources.'
  },
  sources: [
    'Construction/',
    'src/lib/ai/rag.ts',
    'src/lib/ai/blogSearch.ts'
  ]
};
