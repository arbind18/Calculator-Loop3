import type { TrainingCategory } from '../types';

export const healthCategory: TrainingCategory = {
  id: 'health',
  title: { en: 'Health', hi: 'Health' },
  description: {
    en: 'Health calculators + supporting knowledge sources.',
    hi: 'Health calculators + supporting knowledge sources.'
  },
  sources: [
    'Health/',
    'src/ai-training/ai-formulas/formulaKnowledge.ts'
  ]
};
