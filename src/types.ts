export interface Joke {
  id: string;
  joke: string;
}

export type Reaction = 'loved' | 'not-funny';

export interface SortedJoke extends Joke {
  reaction: Reaction;
  timeSpent: number; // Seconds
}
