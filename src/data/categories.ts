export interface Category {
  readonly id: CategoryId;
  readonly name: string;
  readonly emoji: string;
  readonly description: string;
  /** Tailwind gradient classes used for the category's cards */
  readonly gradient: string;
}

export type CategoryId = 'romantikk' | 'jobb' | 'vennskap' | 'familie' | 'dypt' | 'moro';

export const categories: readonly Category[] = [
  {
    id: 'romantikk',
    name: 'Romantikk & dating',
    emoji: '💞',
    description: 'For dates, kjærester og de som vil bli bedre kjent på ekte.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    id: 'jobb',
    name: 'Jobb & karriere',
    emoji: '💼',
    description: 'For kolleger, team, mentorer og medarbeidersamtaler.',
    gradient: 'from-sky-500 to-indigo-600',
  },
  {
    id: 'vennskap',
    name: 'Vennskap',
    emoji: '🤝',
    description: 'For gamle og nye venner som vil gå et lag dypere.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'familie',
    name: 'Familie & oppvekst',
    emoji: '🏡',
    description: 'For middagsbordet, hyttetur og besøk hos besteforeldre.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'dypt',
    name: 'Dype tanker',
    emoji: '🌌',
    description: 'Filosofiske spørsmål om livet, verdier og meningen med alt.',
    gradient: 'from-violet-500 to-purple-700',
  },
  {
    id: 'moro',
    name: 'Moro & isbrytere',
    emoji: '🎉',
    description: 'Lette og morsomme spørsmål for vorspiel, bilturer og nye grupper.',
    gradient: 'from-yellow-400 to-orange-500',
  },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
