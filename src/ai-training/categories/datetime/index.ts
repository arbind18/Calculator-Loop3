import type { TrainingCategory } from '../types';

export const datetimeCategory: TrainingCategory = {
  id: 'datetime',
  title: { en: 'Date & Time', hi: 'Date & Time' },
  description: {
    en: 'Date/time calculators + supporting knowledge sources.',
    hi: 'Date/time calculators + supporting knowledge sources.'
  },
  sources: [
    'DateTime/',
    'src/lib/ai/rag.ts',
    'src/lib/ai/blogSearch.ts'
  ]
};
