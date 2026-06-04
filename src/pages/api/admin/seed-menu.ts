// GET /api/admin/seed-menu
// One-time (re-)seed: deletes all menu_items then inserts every dish from MENU.md.
// Protected by admin middleware. Safe to call multiple times (idempotent via DELETE+INSERT).
export const prerender = false;

import type { APIContext } from 'astro';
import { cfEnv } from '../../../lib/env';

// Hungarian thousands-separator price formatter: 3950 → "3 950 Ft"
function p(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Ft';
}

type M = {
  category: string;
  subcategory?: string | null;
  name: string;
  description?: string | null;
  price_display: string;
  price_min: number;
  sort_order: number;
  allergens?: string | null;
};

const ITEMS: M[] = [
  // ── LEVESEK ─────────────────────────────────────────────────────────────
  { category: 'Levesek', name: 'Májgombóc leves',                  description: 'Házi májgombóc, leveszöldségekkel',         price_display: p(1550),  price_min: 1550,  sort_order: 1,  allergens: '1,2,7,15' },
  { category: 'Levesek', name: 'Erdei gyümölcsleves',               description: 'Selymes, tejszínes',                       price_display: p(1650),  price_min: 1650,  sort_order: 2,  allergens: '2' },
  { category: 'Levesek', name: 'Tárkonyos raguleves',               description: 'Pirított csirkemell-kockákkal',             price_display: p(1750),  price_min: 1750,  sort_order: 3,  allergens: '2,7,15' },
  { category: 'Levesek', name: 'Újházi tyúkhúsleves csigatésztával',                                                         price_display: p(1850),  price_min: 1850,  sort_order: 4,  allergens: '1,7,15' },
  { category: 'Levesek', name: 'Babgulyás füstölt csülökkel',       description: 'Kalocsai paprikával, galuskával',           price_display: p(1950),  price_min: 1950,  sort_order: 5,  allergens: '7,15' },
  { category: 'Levesek', name: 'Marhagulyás',                       description: 'Lassú tűzön főtt marhanyak',               price_display: p(2350),  price_min: 2350,  sort_order: 6,  allergens: '15' },
  { category: 'Levesek', name: 'Harcsa halászlé bográcsban',        description: 'Afrikai harcsafilével',                    price_display: p(3350),  price_min: 3350,  sort_order: 7,  allergens: '9,15' },

  // ── SÜLTES TÁLAK – 2 személyes ──────────────────────────────────────────
  { category: 'Sültes tálak', subcategory: '2 személyes', name: 'Szerelmes tál', description: 'Háromféle töltött/rántott csirkemell, steak burgonya, rizs',                                                              price_display: p(9350),  price_min: 9350,  sort_order: 1,  allergens: '1,2,7' },
  { category: 'Sültes tálak', subcategory: '2 személyes', name: 'Csülök tál',    description: 'Egészben sült füstölt csülök, lilakáposzta, mézes alma, steak burgonya',                                                  price_display: p(9350),  price_min: 9350,  sort_order: 2,  allergens: '15,16' },
  { category: 'Sültes tálak', subcategory: '2 személyes', name: 'Kacsa tál',     description: 'Rozé kacsamell, konfitált comb, lilakáposzta, mézes alma, steak burgonya',                                                price_display: p(9950),  price_min: 9950,  sort_order: 3,  allergens: '15' },

  // ── SÜLTES TÁLAK – 4 személyes ──────────────────────────────────────────
  { category: 'Sültes tálak', subcategory: '4 személyes', name: '1957 Retró tál', description: 'Rántott gomba, sajt, szezámos szelet, cordon bleu, csirke steak, burgonya, rizs',                                        price_display: p(18250), price_min: 18250, sort_order: 4,  allergens: '1,2,7' },
  { category: 'Sültes tálak', subcategory: '4 személyes', name: 'Családi tál',    description: 'Rántott csirkemell, sajt, mátrai borzas, cigánypecsenye, kanász király lakomája, burgonya, rizs',                        price_display: p(19900), price_min: 19900, sort_order: 5,  allergens: '1,2,7,15,16' },
  { category: 'Sültes tálak', subcategory: '4 személyes', name: 'Kalocsa tál',    description: 'Séf gomba, hagymakarika, cordon bleu, pelyhes pipi, tomahawk, füstölt csülök, kacsacomb, burgonya, mártogatósok',        price_display: p(22900), price_min: 22900, sort_order: 6,  allergens: '1,2,7,15' },

  // ── GYEREK MENÜ ─────────────────────────────────────────────────────────
  { category: 'Gyerek menü', name: 'Pelyhes pipi Jr.',  description: 'Gabonapelyhes csirkemell, mártogatós, köret', price_display: p(2650), price_min: 2650, sort_order: 1, allergens: '1,2,7' },
  { category: 'Gyerek menü', name: 'Három kismalac',    description: 'Sonkás-sajtos panírozott falatok, köret',     price_display: p(2650), price_min: 2650, sort_order: 2, allergens: '1,2,7' },
  { category: 'Gyerek menü', name: 'Egér lakoma',       description: 'Bundás sajt, köret',                          price_display: p(2650), price_min: 2650, sort_order: 3, allergens: '1,2,7' },
  { category: 'Gyerek menü', name: 'Csiszi csusza',     description: 'Túrós csusza, tepertővel vagy anélkül',       price_display: p(2350), price_min: 2350, sort_order: 4, allergens: '1,2,7' },

  // ── SZÁRNYASOK ──────────────────────────────────────────────────────────
  { category: 'Szárnyasok', name: 'Vasalt szaftos csirkemell steak',                                                            price_display: p(3400), price_min: 3400, sort_order: 1, allergens: '15,16' },
  { category: 'Szárnyasok', name: 'Pelyhes pipi',                        description: 'Fokhagymás mártogatós',                  price_display: p(3550), price_min: 3550, sort_order: 2, allergens: '1,2,7' },
  { category: 'Szárnyasok', name: 'Baconba tekert, szilvával töltött csirkemell',                                               price_display: p(3750), price_min: 3750, sort_order: 3, allergens: '15' },
  { category: 'Szárnyasok', name: 'Áfonyás camemberttel töltött csirkemell',                                                    price_display: p(3750), price_min: 3750, sort_order: 4, allergens: '2,15' },
  { category: 'Szárnyasok', name: 'Vermutos csirkemell steak',                                                                  price_display: p(3750), price_min: 3750, sort_order: 5, allergens: '2,15' },
  { category: 'Szárnyasok', name: 'Vasalt gyros csirkemell steak',       description: 'Fokhagymás kapormártással',              price_display: p(3750), price_min: 3750, sort_order: 6, allergens: '15,16' },
  { category: 'Szárnyasok', name: 'Szilvapálinkás mázas csirkemell steak',                                                      price_display: p(3950), price_min: 3950, sort_order: 7, allergens: '15' },

  // ── KACSASÜLTEK ─────────────────────────────────────────────────────────
  { category: 'Kacsasültek', name: 'Konfitált kacsacomb párolt káposztával',                                          price_display: p(4450), price_min: 4450, sort_order: 1, allergens: '15' },
  { category: 'Kacsasültek', name: 'Kacsa tányéros',  description: 'Comb + pácolt kacsamell steak',                  price_display: p(4700), price_min: 4700, sort_order: 2, allergens: '15,16' },
  { category: 'Kacsasültek', name: 'Rozmaringos rozé kacsamell',                                                      price_display: p(5250), price_min: 5250, sort_order: 3, allergens: '15' },

  // ── SERTÉSSÜLTEK ────────────────────────────────────────────────────────
  { category: 'Sertéssültek', name: 'Brassói szűzpecsenye',    description: 'Kockaburgonyával',                       price_display: p(4750), price_min: 4750, sort_order: 1, allergens: '7,15' },
  { category: 'Sertéssültek', name: 'Mátrai borzas',           description: 'Burgonyabundában, tejföllel, sajttal',   price_display: p(3750), price_min: 3750, sort_order: 2, allergens: '1,2,7' },
  { category: 'Sertéssültek', name: 'Cigánypecsenye kakastaréjjal',                                                   price_display: p(3850), price_min: 3850, sort_order: 3, allergens: '15,16' },
  { category: 'Sertéssültek', name: 'Csülök tányéros',         description: 'Lilakáposzta, tormás mártogatós',        price_display: p(3900), price_min: 3900, sort_order: 4, allergens: '15,16' },
  { category: 'Sertéssültek', name: 'Tomahawk karaj',                                                                 price_display: p(4150), price_min: 4150, sort_order: 5, allergens: '15,16' },
  { category: 'Sertéssültek', name: 'Lecsó parádé',            description: 'Lecsós-kolbászos feltét, tükörtojás',   price_display: p(4000), price_min: 4000, sort_order: 6, allergens: '1,15' },
  { category: 'Sertéssültek', name: 'Szende szűz',             description: 'Lestyánba forgatva, baconba tekerve',   price_display: p(4250), price_min: 4250, sort_order: 7, allergens: '15' },
  { category: 'Sertéssültek', name: 'Zsenge szűz',             description: 'Borskéregben sült szűzpecsenye',        price_display: p(4350), price_min: 4350, sort_order: 8, allergens: '15,16' },

  // ── MARHASÜLTEK (25 dkg · Rostélyos / Argentin / Bélszín) ──────────────
  { category: 'Marhasültek', subcategory: '25 dkg · Rostélyos / Argentin / Bélszín', name: 'New York steak',     description: 'Fokhagymás négyborssal',                                     price_display: '5 700 / 7 700 / 8 700 Ft', price_min: 5700,  sort_order: 1, allergens: '15,16' },
  { category: 'Marhasültek', subcategory: '25 dkg · Rostélyos / Argentin / Bélszín', name: 'Hagymás rostélyos', description: 'Mustárosan, sült hagymakarikákkal',                             price_display: '5 900 / 7 900 / 8 900 Ft', price_min: 5900,  sort_order: 2, allergens: '15,16' },
  { category: 'Marhasültek', subcategory: '25 dkg · Rostélyos / Argentin / Bélszín', name: 'Szerencsés marha',  description: 'Whiskys BBQ szósszal',                                        price_display: '6 700 / 8 700 / 9 700 Ft', price_min: 6700,  sort_order: 3, allergens: '15,16' },
  { category: 'Marhasültek', subcategory: '25 dkg · Rostélyos / Argentin / Bélszín', name: 'Részeg marha',      description: 'Szilvapálinka-mázas BBQ',                                      price_display: '6 700 / 8 700 / 9 700 Ft', price_min: 6700,  sort_order: 4, allergens: '15,16' },
  { category: 'Marhasültek', subcategory: '25 dkg · Rostélyos / Argentin / Bélszín', name: 'Vad marha',         description: 'Vadas mártással, grillzöldséggel, szalvétagombóccal',         price_display: '7 500 / 9 500 / 10 500 Ft',price_min: 7500,  sort_order: 5, allergens: '7,15' },

  // ── PÖRKÖLTEK ───────────────────────────────────────────────────────────
  { category: 'Pörköltek', name: 'Csülök pörkölt',                                   price_display: p(3350), price_min: 3350, sort_order: 1, allergens: '15' },
  { category: 'Pörköltek', name: 'Pacal pörkölt',                                    price_display: p(3550), price_min: 3550, sort_order: 2, allergens: '15' },
  { category: 'Pörköltek', name: 'Marha pörkölt',  description: 'Kalocsai paprikával', price_display: p(3950), price_min: 3950, sort_order: 3, allergens: '15' },

  // ── HALAK ───────────────────────────────────────────────────────────────
  { category: 'Halak', name: 'Harcsapaprikás túróscsuszával',                         price_display: p(5850), price_min: 5850, sort_order: 1, allergens: '1,2,7,9' },
  { category: 'Halak', name: 'Panka harcsa',           description: 'Pankó morzsában',   price_display: p(3950), price_min: 3950, sort_order: 2, allergens: '1,7,9' },
  { category: 'Halak', name: 'Vaslapon sült kapros-citromos harcsa',                  price_display: p(3850), price_min: 3850, sort_order: 3, allergens: '9' },

  // ── TÉSZTÁK ─────────────────────────────────────────────────────────────
  { category: 'Tészták', name: 'Túrós csusza',        description: 'Szalonnatepertővel',        price_display: p(3350), price_min: 3350, sort_order: 1, allergens: '1,2,7' },
  { category: 'Tészták', name: 'Juhtúrós sztrapacska', description: 'Tepertővel, lilahagymával', price_display: p(3450), price_min: 3450, sort_order: 2, allergens: '1,2,7' },

  // ── RÁNTOTTAK ───────────────────────────────────────────────────────────
  { category: 'Rántottak', name: 'Rántott hagymakarika',                                           price_display: p(3050), price_min: 3050, sort_order: 1, allergens: '1,2,7' },
  { category: 'Rántottak', name: 'Rántott gomba',                                                  price_display: p(3050), price_min: 3050, sort_order: 2, allergens: '1,2,7' },
  { category: 'Rántottak', name: 'Rántott sajt',                                                   price_display: p(3350), price_min: 3350, sort_order: 3, allergens: '1,2,7' },
  { category: 'Rántottak', name: 'Rántott sertésszelet',                                           price_display: p(3350), price_min: 3350, sort_order: 4, allergens: '1,2,7' },
  { category: 'Rántottak', name: 'Rántott csirkemell',                                             price_display: p(3350), price_min: 3350, sort_order: 5, allergens: '1,2,7' },
  { category: 'Rántottak', name: 'Cordon Bleu',             description: 'Sajttal-sonkával töltve', price_display: p(3650), price_min: 3650, sort_order: 6, allergens: '1,2,7' },
  { category: 'Rántottak', name: 'Kanász király lakomája',  description: 'Füstölt csülök, uborka, torma, tojás, sajt töltelék', price_display: p(3850), price_min: 3850, sort_order: 7, allergens: '1,2,7' },
  { category: 'Rántottak', name: 'Óriás bécsi szelet',     description: '30 dkg',                  price_display: p(4650), price_min: 4650, sort_order: 8, allergens: '1,2,7' },

  // ── HAMBURGEREK ─────────────────────────────────────────────────────────
  { category: 'Hamburgerek', name: '1957 Retró burger', description: '15 dkg marha',                         price_display: p(2450), price_min: 2450, sort_order: 1, allergens: '1,2,7' },
  { category: 'Hamburgerek', name: 'Sajt burger',       description: 'Dupla sajt',                           price_display: p(2650), price_min: 2650, sort_order: 2, allergens: '2,7' },
  { category: 'Hamburgerek', name: 'Pipi burger',       description: 'Pelyhes pipi csirkemell',              price_display: p(2450), price_min: 2450, sort_order: 3, allergens: '1,2,7' },
  { category: 'Hamburgerek', name: 'Farmer burger',     description: '15 dkg sertés, bacon, sajt',           price_display: p(2650), price_min: 2650, sort_order: 4, allergens: '2,7' },
  { category: 'Hamburgerek', name: 'Black Jack burger', description: 'Whiskys BBQ, bacon, sajt',             price_display: p(2850), price_min: 2850, sort_order: 5, allergens: '2,7,16' },
  { category: 'Hamburgerek', name: 'BAD Boy burger',    description: 'Chilis majonéz, jalapeño',             price_display: p(2950), price_min: 2950, sort_order: 6, allergens: '2,7,16' },
  { category: 'Hamburgerek', name: 'BIG Boy burger',    description: '2×15 dkg marha, tripla sajt',          price_display: p(3850), price_min: 3850, sort_order: 7, allergens: '1,2,7' },
  { category: 'Hamburgerek', name: 'Hasábburgonya',     description: 'Csak hamburger mellé',                 price_display: p(500),  price_min: 500,  sort_order: 8, allergens: null },

  // ── KÖRETEK ─────────────────────────────────────────────────────────────
  { category: 'Köretek', name: 'Párolt rizs',                                               price_display: p(850),  price_min: 850,  sort_order: 1,  allergens: null },
  { category: 'Köretek', name: 'Rizibizi',                                                  price_display: p(950),  price_min: 950,  sort_order: 2,  allergens: null },
  { category: 'Köretek', name: 'Hasábburgonya',                                             price_display: p(950),  price_min: 950,  sort_order: 3,  allergens: null },
  { category: 'Köretek', name: 'Steak burgonya',                                            price_display: p(950),  price_min: 950,  sort_order: 4,  allergens: null },
  { category: 'Köretek', name: 'Édesburgonya',                                              price_display: p(1450), price_min: 1450, sort_order: 5,  allergens: null },
  { category: 'Köretek', name: 'Burgonyapüré',                                              price_display: p(950),  price_min: 950,  sort_order: 6,  allergens: '2' },
  { category: 'Köretek', name: 'Főtt burgonya',                                             price_display: p(850),  price_min: 850,  sort_order: 7,  allergens: null },
  { category: 'Köretek', name: 'Petrezselymes burgonya',                                    price_display: p(950),  price_min: 950,  sort_order: 8,  allergens: null },
  { category: 'Köretek', name: 'Galuska',                                                   price_display: p(950),  price_min: 950,  sort_order: 9,  allergens: '1,7' },
  { category: 'Köretek', name: 'Betyár burgonya',   description: 'Gerezdek, kápia, sült hagyma, szalonna',   price_display: p(1350), price_min: 1350, sort_order: 10, allergens: '2' },
  { category: 'Köretek', name: 'New York burgonya', description: 'Hájában sült, fokhagymás tejföl, sajt',    price_display: p(1350), price_min: 1350, sort_order: 11, allergens: '2' },
  { category: 'Köretek', name: 'Párolt zöldség',                                            price_display: p(1550), price_min: 1550, sort_order: 12, allergens: null },
  { category: 'Köretek', name: 'Grill zöldség',                                             price_display: p(1550), price_min: 1550, sort_order: 13, allergens: null },

  // ── SALÁTÁK, SAVANYÚK ───────────────────────────────────────────────────
  { category: 'Saláták, savanyúk', name: 'Csemege uborka',          price_display: p(850),  price_min: 850,  sort_order: 1,  allergens: null },
  { category: 'Saláták, savanyúk', name: 'Kovászos uborka',         price_display: p(850),  price_min: 850,  sort_order: 2,  allergens: null },
  { category: 'Saláták, savanyúk', name: 'Káposztasaláta',          price_display: p(850),  price_min: 850,  sort_order: 3,  allergens: null },
  { category: 'Saláták, savanyúk', name: 'Vegyes vágott',           price_display: p(850),  price_min: 850,  sort_order: 4,  allergens: null },
  { category: 'Saláták, savanyúk', name: 'Csípős almapaprika',      price_display: p(850),  price_min: 850,  sort_order: 5,  allergens: null },
  { category: 'Saláták, savanyúk', name: 'Uborkasaláta',            price_display: p(850),  price_min: 850,  sort_order: 6,  allergens: null },
  { category: 'Saláták, savanyúk', name: 'Tejfölös uborkasaláta',   price_display: p(950),  price_min: 950,  sort_order: 7,  allergens: null },
  { category: 'Saláták, savanyúk', name: 'Párolt lilakáposzta',     price_display: p(950),  price_min: 950,  sort_order: 8,  allergens: null },
  { category: 'Saláták, savanyúk', name: 'Paradicsomsaláta',        price_display: p(1250), price_min: 1250, sort_order: 9,  allergens: null },
  { category: 'Saláták, savanyúk', name: 'Coleslaw saláta',         price_display: p(1350), price_min: 1350, sort_order: 10, allergens: '16' },
  { category: 'Saláták, savanyúk', name: 'Kevert magos saláta',     price_display: p(1650), price_min: 1650, sort_order: 11, allergens: '6' },

  // ── SZÓSZOK, MÁRTÁSOK ───────────────────────────────────────────────────
  { category: 'Szószok, mártások', name: 'Ketchup',                   price_display: p(500),  price_min: 500,  sort_order: 1,  allergens: null },
  { category: 'Szószok, mártások', name: 'Mustár',                    price_display: p(500),  price_min: 500,  sort_order: 2,  allergens: '16' },
  { category: 'Szószok, mártások', name: 'Majonéz',                   price_display: p(500),  price_min: 500,  sort_order: 3,  allergens: '1,16' },
  { category: 'Szószok, mártások', name: 'Tartármártás',               price_display: p(750),  price_min: 750,  sort_order: 4,  allergens: '1' },
  { category: 'Szószok, mártások', name: 'Fokhagymás mártogatós',     price_display: p(750),  price_min: 750,  sort_order: 5,  allergens: '2' },
  { category: 'Szószok, mártások', name: 'Tormás mártogatós',         price_display: p(750),  price_min: 750,  sort_order: 6,  allergens: '16' },
  { category: 'Szószok, mártások', name: 'Csíki mártás',              price_display: p(950),  price_min: 950,  sort_order: 7,  allergens: '2' },
  { category: 'Szószok, mártások', name: 'Whiskys BBQ',               price_display: p(1050), price_min: 1050, sort_order: 8,  allergens: null },
  { category: 'Szószok, mártások', name: 'Szilvapálinka-mázas BBQ',   price_display: p(1050), price_min: 1050, sort_order: 9,  allergens: null },

  // ── DESSZERTEK ──────────────────────────────────────────────────────────
  { category: 'Desszertek', name: 'Palacsinta több ízben',            description: 'Kakaós/nutellás/túrós/baracklekváros/fahéjas', price_display: p(600),  price_min: 600,  sort_order: 1, allergens: '1,2,7' },
  { category: 'Desszertek', name: 'Gesztenyepüré',                    description: 'Tejszínhabbal',                                 price_display: p(1450), price_min: 1450, sort_order: 2, allergens: '2,3' },
  { category: 'Desszertek', name: 'Mákos nudli',                      description: 'Vanília alapon',                                price_display: p(1650), price_min: 1650, sort_order: 3, allergens: '1,2,7' },
  { category: 'Desszertek', name: 'Lávafolyam',                       description: 'Francia csokoládés szuflé',                     price_display: p(1750), price_min: 1750, sort_order: 4, allergens: '1,2,7' },
  { category: 'Desszertek', name: 'Erdei gyümölcsös sajttorta (vegán)',                                                             price_display: p(1750), price_min: 1750, sort_order: 5, allergens: null },
  { category: 'Desszertek', name: 'Őrség kincse tortaszelet',          description: 'Magyarország tortája 2016',                    price_display: p(1850), price_min: 1850, sort_order: 6, allergens: '1,2,3,7' },

  // ── ITALOK ──────────────────────────────────────────────────────────────
  // Üdítők
  { category: 'Italok', subcategory: 'Üdítők',            name: 'Üdítő (0,25 l)',            description: 'Coca-Cola, Cola Zéró, Fanta, Sprite, Kinley, Fuze Tea',    price_display: p(650),  price_min: 650,  sort_order: 1,  allergens: null },
  { category: 'Italok', subcategory: 'Üdítők',            name: 'Cappy gyümölcslé (0,25 l)',                                                                          price_display: p(700),  price_min: 700,  sort_order: 2,  allergens: null },
  // Vizek
  { category: 'Italok', subcategory: 'Vizek',             name: 'Szóda (1 dl)',                                                                                        price_display: p(150),  price_min: 150,  sort_order: 3,  allergens: null },
  { category: 'Italok', subcategory: 'Vizek',             name: 'NaturAqua (0,33 l)',                                                                                  price_display: p(550),  price_min: 550,  sort_order: 4,  allergens: null },
  { category: 'Italok', subcategory: 'Vizek',             name: 'Hell energy ital (0,25 l)',                                                                           price_display: p(600),  price_min: 600,  sort_order: 5,  allergens: null },
  // Limonádé
  { category: 'Italok', subcategory: 'Limonádé, szörp',  name: 'Limonádé / házi szörp (3 dl)',                                                                        price_display: p(600),  price_min: 600,  sort_order: 6,  allergens: null },
  { category: 'Italok', subcategory: 'Limonádé, szörp',  name: 'Limonádé / házi szörp (5 dl)',                                                                        price_display: p(1000), price_min: 1000, sort_order: 7,  allergens: null },
  { category: 'Italok', subcategory: 'Limonádé, szörp',  name: 'Limonádé / házi szörp (1 l)',                                                                         price_display: p(2000), price_min: 2000, sort_order: 8,  allergens: null },
  // Kávék
  { category: 'Italok', subcategory: 'Kávék',            name: 'Eszpresszó',                                                                                          price_display: p(600),  price_min: 600,  sort_order: 9,  allergens: null },
  { category: 'Italok', subcategory: 'Kávék',            name: 'Cappuccino / latte',                                                                                  price_display: p(900),  price_min: 900,  sort_order: 10, allergens: '2' },
  { category: 'Italok', subcategory: 'Kávék',            name: 'Forró csokoládé',                                                                                     price_display: p(750),  price_min: 750,  sort_order: 11, allergens: '2' },
  { category: 'Italok', subcategory: 'Kávék',            name: 'Ice caffé',                                                                                           price_display: p(1550), price_min: 1550, sort_order: 12, allergens: '2' },
  // Sörök
  { category: 'Italok', subcategory: 'Sörök',            name: 'Csapolt Gösser (3 dl)',                                                                               price_display: p(750),  price_min: 750,  sort_order: 13, allergens: null },
  { category: 'Italok', subcategory: 'Sörök',            name: 'Csapolt Gösser (5 dl)',                                                                               price_display: p(1250), price_min: 1250, sort_order: 14, allergens: null },
  { category: 'Italok', subcategory: 'Sörök',            name: 'Sör üveges (0,5 l)',        description: 'Soproni Démon, Pilsner Urquell, Krusovice, Heineken',       price_display: p(1300), price_min: 1300, sort_order: 15, allergens: null },
  { category: 'Italok', subcategory: 'Sörök',            name: 'Sommersby (0,5 l)',                                                                                   price_display: p(1100), price_min: 1100, sort_order: 16, allergens: null },
  { category: 'Italok', subcategory: 'Sörök',            name: 'Alkoholmentes sör',                                                                                   price_display: p(800),  price_min: 800,  sort_order: 17, allergens: null },
  // Borok
  { category: 'Italok', subcategory: 'Borok',            name: 'Bor (0,75 l)',              description: 'Frittmann / Varga',                                         price_display: p(4800), price_min: 4800, sort_order: 18, allergens: null },
  { category: 'Italok', subcategory: 'Borok',            name: 'Bor (1 dl)',                description: 'Frittmann / Varga',                                         price_display: p(650),  price_min: 650,  sort_order: 19, allergens: null },
  { category: 'Italok', subcategory: 'Borok',            name: 'Törley pezsgő (0,75 l)',                                                                              price_display: p(4200), price_min: 4200, sort_order: 20, allergens: null },
  { category: 'Italok', subcategory: 'Borok',            name: 'Kölyök pezsgő',                                                                                       price_display: p(2500), price_min: 2500, sort_order: 21, allergens: null },
  // Pálinkák
  { category: 'Italok', subcategory: 'Pálinkák',         name: 'Pálinka (2–5 cl)',          description: 'Mihócsa 45%, Márkházi, Rézangyal, Bolyhos',                price_display: '850 – 1 600 Ft', price_min: 850,  sort_order: 22, allergens: null },
  // Röviditalok
  { category: 'Italok', subcategory: 'Röviditalok, likőrök', name: 'Rövidital / likőr (2–4 cl)', description: 'Unikum, Jägermeister, whiskyk, rumok, tequila, vodka, gin, Baileys, Martini', price_display: '600 – 2 300 Ft', price_min: 600, sort_order: 23, allergens: null },
];

export async function GET(_ctx: APIContext) {
  const db = cfEnv.DB;
  if (!db) return json({ error: 'DB binding not found' }, 500);

  try {
    // Delete all existing menu items (fresh seed)
    await db.prepare('DELETE FROM menu_items').run();

    // Batch insert all items
    const stmts = ITEMS.map((item) =>
      db.prepare(`
        INSERT INTO menu_items
          (category, subcategory, name, description, price_display, price_min, allergens, sort_order, is_active, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
      `).bind(
        item.category,
        item.subcategory ?? null,
        item.name,
        item.description ?? null,
        item.price_display,
        item.price_min,
        item.allergens ?? null,
        item.sort_order,
      )
    );

    await db.batch(stmts);

    return json({ ok: true, inserted: ITEMS.length, message: `${ITEMS.length} étlap tétel sikeresen betöltve.` });
  } catch (err: any) {
    return json({ error: err?.message ?? 'Unknown error' }, 500);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
