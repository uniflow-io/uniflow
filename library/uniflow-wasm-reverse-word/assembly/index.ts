declare function prompt(defaultValue: string): string

export function reverseWord(word: string): string {
  let a = prompt('toto');
  return word.split('').reverse().join('') + a
}
