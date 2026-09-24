// Type-only: every translation must have exactly the keys English has, so a
// string added to en.json fails the build until each language has it too.
import type de from "../messages/de.json";
import type en from "../messages/en.json";
import type es from "../messages/es.json";
import type fr from "../messages/fr.json";
import type it from "../messages/it.json";
import type ja from "../messages/ja.json";
import type ptBR from "../messages/pt-br.json";
import type ru from "../messages/ru.json";
import type tr from "../messages/tr.json";
import type zhHans from "../messages/zh-hans.json";
import type zhHant from "../messages/zh-hant.json";

type SameKeys<A, B> = [A] extends [string]
  ? [B] extends [string]
    ? true
    : false
  : [keyof A] extends [keyof B]
    ? [keyof B] extends [keyof A]
      ? { [K in keyof A & keyof B]: SameKeys<A[K], B[K]> }[keyof A & keyof B] extends true
        ? true
        : false
      : false
    : false;

type Assert<T extends true> = T;

export type Checks = [
  Assert<SameKeys<typeof en, typeof de>>,
  Assert<SameKeys<typeof en, typeof es>>,
  Assert<SameKeys<typeof en, typeof fr>>,
  Assert<SameKeys<typeof en, typeof it>>,
  Assert<SameKeys<typeof en, typeof ja>>,
  Assert<SameKeys<typeof en, typeof ptBR>>,
  Assert<SameKeys<typeof en, typeof ru>>,
  Assert<SameKeys<typeof en, typeof tr>>,
  Assert<SameKeys<typeof en, typeof zhHans>>,
  Assert<SameKeys<typeof en, typeof zhHant>>,
];
