export const ALLERGENS = [
  { id: 1,  name: 'Gluténtartalmú gabona', short: 'GL' },
  { id: 2,  name: 'Rákfélék',              short: 'RÁ' },
  { id: 3,  name: 'Tojás',                 short: 'TO' },
  { id: 4,  name: 'Hal',                   short: 'HA' },
  { id: 5,  name: 'Földimogyoró',          short: 'FM' },
  { id: 6,  name: 'Szója',                 short: 'SZ' },
  { id: 7,  name: 'Tej/tejszármazékok',    short: 'TE' },
  { id: 8,  name: 'Dió-félék',             short: 'DI' },
  { id: 9,  name: 'Zeller',                short: 'ZE' },
  { id: 10, name: 'Mustár',                short: 'MU' },
  { id: 11, name: 'Szezámmag',             short: 'SE' },
  { id: 12, name: 'Kén-dioxid/szulfit',    short: 'KÉ' },
  { id: 13, name: 'Csillagfürt',           short: 'CS' },
  { id: 14, name: 'Puhatestűek',           short: 'PU' },
] as const;

export type AllergenId = typeof ALLERGENS[number]['id'];

// Parse "1,3,7" → [1, 3, 7]
export function parseAllergens(str: string | null | undefined): number[] {
  if (!str) return [];
  return str.split(',').map(Number).filter(n => n >= 1 && n <= 14);
}
