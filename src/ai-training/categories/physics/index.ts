import type { TrainingCategory } from '../types';

export const physicsCategory: TrainingCategory = {
  id: 'physics',
  title: { en: 'Physics', hi: 'Physics' },
  description: {
    en: 'Physics calculators + supporting knowledge sources.',
    hi: 'Physics calculators + supporting knowledge sources.'
  },
  sources: [
    'Physics/',
    'src/lib/logic-ai/rag.ts',
    'src/lib/logic-ai/blogSearch.ts'
  ]
};
