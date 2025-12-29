export type TrainingCategoryId =
  | 'business'
  | 'construction'
  | 'datetime'
  | 'education'
  | 'everyday'
  | 'health'
  | 'math'
  | 'physics'
  | 'scientific'
  | 'technology';

export type TrainingCategory = {
  id: TrainingCategoryId;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  /** Workspace-relative file paths that contain the knowledge/logic for this category. */
  sources: string[];
};
