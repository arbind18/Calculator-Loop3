import type { TrainingCategory } from '../types';

export const mathCategory: TrainingCategory = {
  id: 'math',
  title: { en: 'Math', hi: 'Math (Ganit)' },
  description: {
    en: 'Offline math tutor: numbers, algebra, trigonometry, geometry area, and solver utilities.',
    hi: 'Offline math tutor: sankhya, algebra, trigonometry, geometry (kshetrafal/ayatan), aur solver utilities.'
  },
  sources: [
    'src/lib/logic-ai/mathSolver.ts',
    'src/lib/logic-ai/numberTutorResponder.ts',
    'src/lib/logic-ai/algebraIdentityResponder.ts',
    'src/lib/logic-ai/trigProofResponder.ts',
    'src/lib/logic-ai/geometryAreaResponder.ts',
    'src/ai-training/ai-formulas/formulaKnowledge.ts',
    'src/ai-training/ai-questions-answers/customKnowledge.ts',
    'src/app/api/ai/chat/route.ts'
  ]
};
