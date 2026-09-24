// Line-break fixes for Chinese and Japanese, which browsers break between any
// two characters. Two breaks read as mistakes there:
//
// - A "——" dash at the start of a line, cut off from the phrase it follows.
//   A word joiner (U+2060) before it forbids that break.
// - A Latin name split across lines ("Homebrew / cask"). Its inner spaces
//   become no-break spaces. This is a fixed list rather than "every run of
//   Latin words": a long English quote inside a Chinese sentence must still be
//   free to wrap, or it overflows a phone.
const CJK = /^(ja|zh)/;

const TERMS = [
  "Mac App Store",
  "App Store",
  "Apple Silicon",
  "macOS 15",
  "Apple Developer",
  "Developer ID",
  "Team ID",
  "bundle id",
  "Homebrew cask",
  "Sparkle appcast",
  "Release Log",
  "Mac App",
  "iPhone App",
  "Mac app",
  "iPhone app",
];

const TERM_PATTERN = new RegExp(
  TERMS.map((term) => term.replace(/ /g, "\\s")).join("|"),
  "g",
);

export function typeset(locale: string, text: string): string {
  if (!CJK.test(locale)) return text;
  return text
    .replace(/(?<=\S)——/g, "⁠——")
    .replace(TERM_PATTERN, (term) => term.replace(/\s/g, " "));
}
