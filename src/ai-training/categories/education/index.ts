import type { TrainingCategory } from '../types';

export const educationCategory: TrainingCategory = {
  id: 'education',
  title: { en: 'Education', hi: 'Education' },
  description: {
    en: 'Education calculators + supporting knowledge sources.',
    hi: 'Education calculators + supporting knowledge sources.'
  },
  sources: [
    'Education/',
    'src/lib/logic-ai/rag.ts',
    'src/lib/logic-ai/blogSearch.ts'
  ]
};
