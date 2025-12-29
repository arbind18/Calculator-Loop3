import type { TrainingCategory } from '../types';

export const scientificCategory: TrainingCategory = {
  id: 'scientific',
  title: { en: 'Scientific', hi: 'Scientific' },
  description: {
    en: 'Scientific calculators + supporting knowledge sources.',
    hi: 'Scientific calculators + supporting knowledge sources.'
  },
  sources: [
    'Scientific/',
    'src/lib/ai/rag.ts',
    'src/lib/ai/blogSearch.ts'
  ]
};
