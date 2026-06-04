export const ALLERGENS = [
  { id:  1, name: 'Tojás és abból készült termékek',                          short: 'TO' },
  { id:  2, name: 'Tej és abból készült termékek (laktóz)',                   short: 'TE' },
  { id:  3, name: 'Dió félék és azokból készült termékek',                    short: 'DI' },
  { id:  4, name: 'Gomba és gombafélékből készült termékek',                  short: 'GO' },
  { id:  5, name: 'Szója és abból készült termékek',                          short: 'SZ' },
  { id:  6, name: 'Szezámmag és abból készült termékek',                      short: 'SE' },
  { id:  7, name: 'Glutént tartalmazó gabonafélék és abból készült termékek', short: 'GL' },
  { id:  8, name: 'Rákfélék és abból készült termékek',                       short: 'RÁ' },
  { id:  9, name: 'Halak és abból készült termékek',                          short: 'HA' },
  { id: 10, name: 'Citrusok és abból készült termékek',                       short: 'CI' },
  { id: 11, name: 'Mogyoró félék és azokból készült termékek',                short: 'FM' },
  { id: 12, name: 'Kagyló félék és azokból készült termékek',                 short: 'KA' },
  { id: 13, name: 'Csillagfürt és azokból készült termékek',                  short: 'CS' },
  { id: 14, name: 'Méz és azokból készült termékek',                          short: 'MÉ' },
  { id: 15, name: 'Zeller és azokból készült termékek',                       short: 'ZE' },
  { id: 16, name: 'Mustár és azokból készült termékek',                       short: 'MU' },
] as const;

export type AllergenId = typeof ALLERGENS[number]['id'];

export function parseAllergens(str: string | null | undefined): number[] {
  if (!str) return [];
  return str.split(',').map(Number).filter(n => n >= 1 && n <= 16);
}
