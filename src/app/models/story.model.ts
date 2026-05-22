export type StoryStatus = 'New' | 'In Progress' | 'Completed' | string;

export interface StoryListItem {
  id: string;
  title: string;
  image: string[];
  status: StoryStatus;
}

export interface WordExploreItem {
  id?: string;
  word: string;
  noun: string;
  meaning: string;
  description: string;
  image: string;
  synonyms: string[];
  antonyms: string[];
}

export interface StoryAdventureSection {
  id?: string;
  paragraphs: string[];
  images: string[];
}

export interface StoryAdventure {
  title: string;
  content: StoryAdventureSection[];
}

export interface BrainQuestItem {
  id?: string;
  question: string;
  options: string[];
  answer: string;
}

export interface StoryDetail extends StoryListItem {
  storyAdventure: StoryAdventure;
  wordExplore: WordExploreItem[];
  brainQuest: BrainQuestItem[];
}
