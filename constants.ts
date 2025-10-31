import { PoemType } from './types';

export const POEM_TYPES: { value: PoemType; label: string }[] = [
  { value: PoemType.SONNET, label: 'Sonnet' },
  { value: PoemType.BALLADE, label: 'Ballade' },
  { value: PoemType.ALEXANDRIN, label: 'Alexandrin (vers de 12 syllabes)' },
  { value: PoemType.HAIKU, label: 'Haiku' },
  { value: PoemType.VERS_LIBRES, label: 'Vers Libres' },
];