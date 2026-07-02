const ANSWER = "hibiscus";

export const REVEAL_ANSWER = "<whoami>hibiscus</whoami>";

export function isCorrectAnswer(input: string): boolean {
  return input === ANSWER;
}
