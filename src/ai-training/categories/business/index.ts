import type { TrainingCategory } from '../types';

export const businessCategory: TrainingCategory = {
  id: 'business',
  title: { en: 'Business', hi: 'Business' },
  description: {
    en: 'Business calculators + supporting knowledge sources.',
    hi: 'Business calculators + supporting knowledge sources.'
  },
  sources: [
    'Business/',
    'src/lib/logic-ai/rag.ts',
    'src/lib/logic-ai/blogSearch.ts'
  ]
};
