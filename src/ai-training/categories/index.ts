import type { TrainingCategory } from './types';

import { businessCategory } from './business';
import { constructionCategory } from './construction';
import { datetimeCategory } from './datetime';
import { educationCategory } from './education';
import { everydayCategory } from './everyday';
import { healthCategory } from './health';
import { mathCategory } from './math';
import { physicsCategory } from './physics';
import { scientificCategory } from './scientific';
import { technologyCategory } from './technology';

export const trainingCategories: TrainingCategory[] = [
  businessCategory,
  constructionCategory,
  datetimeCategory,
  educationCategory,
  everydayCategory,
  healthCategory,
  mathCategory,
  physicsCategory,
  scientificCategory,
  technologyCategory,
];

export const trainingCategoryById = Object.fromEntries(
  trainingCategories.map((c) => [c.id, c])
) as Record<TrainingCategory['id'], TrainingCategory>;
