import type { TrainingCategory } from '../types';

export const everydayCategory: TrainingCategory = {
  id: 'everyday',
  title: { en: 'Everyday', hi: 'Everyday' },
  description: {
    en: 'Everyday calculators + supporting knowledge sources.',
    hi: 'Everyday calculators + supporting knowledge sources.'
  },
  sources: [
    'Everyday/',
    'src/lib/ai/rag.ts',
    'src/lib/ai/blogSearch.ts'
  ]
};
