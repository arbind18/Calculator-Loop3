import type { TrainingCategory } from '../types';

export const mathCategory: TrainingCategory = {
  id: 'math',
  title: { en: 'Math', hi: 'Math (Ganit)' },
  description: {
    en: 'Offline math tutor: numbers, algebra, trigonometry, geometry area, and solver utilities.',
    hi: 'Offline math tutor: sankhya, algebra, trigonometry, geometry (kshetrafal/ayatan), aur solver utilities.'
  },
  sources: [
    'src/lib/ai/mathSolver.ts',
    'src/lib/ai/numberTutorResponder.ts',
    'src/lib/ai/algebraIdentityResponder.ts',
    'src/lib/ai/trigProofResponder.ts',
    'src/lib/ai/geometryAreaResponder.ts',
    'src/ai-training/ai-formulas/formulaKnowledge.ts',
    'src/ai-training/ai-questions-answers/customKnowledge.ts',
    'src/app/api/ai/chat/route.ts'
  ]
};
