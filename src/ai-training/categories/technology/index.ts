import type { TrainingCategory } from '../types';

export const technologyCategory: TrainingCategory = {
  id: 'technology',
  title: { en: 'Technology', hi: 'Technology' },
  description: {
    en: 'Technology calculators + supporting knowledge sources.',
    hi: 'Technology calculators + supporting knowledge sources.'
  },
  sources: [
    'Technology/',
    'src/lib/ai/rag.ts',
    'src/lib/ai/blogSearch.ts'
  ]
};
